import requests
import time
from bs4 import BeautifulSoup
import re
import os
from multiprocessing.dummy import Pool as ThreadPool
import itertools
import json
import boto3
import botocore
import io
from AddonListing import AddonListing

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = "ambrosiaevn"
BASE_URL = 'http://www.ambrosiasw.com'
EVC_URL = BASE_URL + '/games/ev/addons?page='
EVO_URL = BASE_URL + '/games/evo/addons?page='
EVN_URL = BASE_URL + '/games/evn/addons?page='
DATA_DIR = "./storage/"
BASE_DATA_FILE = "site-data.json"

# Change to the site to be scraped
# This updates the url and the data file being uploaded
SCRAPE_URL = EVN_URL

def main():
    max_page = get_page_count(SCRAPE_URL)

    pool = ThreadPool(len(max_page))
    results = pool.starmap(get_data_on_page, zip(itertools.repeat(SCRAPE_URL), max_page))
    pool.close()
    pool.join()

    print("All pages scraped")
    data = [listing for inner in results for listing in inner]

    save_data(data)

    # # local testing
    # with open(DATA_DIR + DATA_FILE, 'r') as read_file:
    #     data = json.load(read_file, object_hook=addon_listing_decoder)

    upload_all_files(data)


def addon_listing_decoder(obj):
    return AddonListing(
        obj['title'],
        obj['file_name'],
        obj['size'],
        obj['author'],
        obj['download_url'],
        obj['s3_url'],
        obj['content_type'],
        obj['upload_date'],
        obj['category'],
        obj['votes'],
        obj['star_rating'],
        obj['download_count'],
        obj['body']
    )


def upload_all_files(data_collection):
    for listing in data_collection:
        print("Uploading %s" % listing.file_name)
        upload_file_to_s3(
            file_name=listing.file_name,
            file_path=None, 
            download_url=listing.download_url,
            subdir=S3_SUBDIR, 
            content_type=listing.content_type, 
            check_exists=True
        )


def upload_file_to_s3(file_name, file_path, download_url, subdir, content_type, check_exists):
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name='us-west-2'
    )
    s3 = session.resource('s3')
    bucket = s3.Bucket(S3_BUCKET)
        
    if len(subdir) > 0:
        path = '/'.join([subdir, file_name])
    else:
        path = file_name

    if check_exists:
        try:
            s3.Object(S3_BUCKET, path).load()
            print("File already exists, skipping")
            return False
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] != '404':
                print("Something went wrong")
                return False

    if download_url is None:
        with open(file_path, 'rb') as data:
            bucket.put_object(Key=path, Body=data, ContentType=content_type, ACL='public-read')
    else:
        bucket.put_object(Key=path, Body=stream_file(download_url), ContentType=content_type, ACL='public-read')


def save_data(data):
    with open(DATA_DIR + DATA_FILE, 'w') as outfile:
        json.dump([listing.__dict__ for listing in data], outfile, indent=3)

    print("Uploading %s" % DATA_FILE)

    upload_file_to_s3(DATA_FILE, DATA_DIR + DATA_FILE, None, "", "application/json", False)

 
def get_data_on_page(url, page):
    print("Gathering data for page %s" % str(page))
    data = []
    response = requests.get(url + str(page))
    soup = BeautifulSoup(response.text, "html.parser")
    elems = soup.findAll('div', {"class": "addonListing"})

    for div in elems:
        data.append(get_data_for_listing(div))
    
    print("Data gathered for page %s" % str(page))
    return data


def get_data_for_listing(div):
    tds = div.findAll('td')
    cleaned_body = ""
    for p in div.findAll('p'):
        for content in p.contents:
            cleaned_body += str(content)

    download_url =  BASE_URL + tds[0].contents[0].a.get("href")

    request1 = requests.head(download_url)
    location = request1.headers['Location']
    file_name = location.split('/')[len(location.split('/')) - 1]

    request2 = requests.head(BASE_URL + location)
    content_type = request2.headers['Content-Type']

    if len(div.find('li', {"class": "current-rating"}).contents) > 0:
        star_rating = div.find('li', {"class": "current-rating"}).contents[0]
    else:
        star_rating = "0"

    return AddonListing(
        title = tds[0].contents[0].a.contents[0],
        file_name = file_name,
        size = tds[0].contents[1].split("|")[0][:-1],
        author = tds[0].contents[1].split("|")[1][4:],
        download_url = download_url,
        s3_url = '/'.join([S3_BUCKET, S3_SUBDIR, file_name]),
        content_type = content_type,
        upload_date = tds[1].contents[0],
        category = tds[1].contents[2].contents[0],
        votes = tds[2].contents[1].contents[0],
        star_rating = star_rating,
        download_count = tds[3].contents[2],
        body = cleaned_body
    )


def stream_file(url):
    request = requests.get(url)
    f = io.BytesIO(request.content)
    f.seek(0)
    time.sleep(1)
    return f


def get_page_count(url):
    response = requests.get(url + '1')
    soup = BeautifulSoup(response.text, "html.parser")
    pages = soup.findAll("a", href=re.compile(r"\?page="))
    return list(range(1, int(pages[len(pages) - 1]['href'].split('=')[1]) + 1))


if (__name__ == '__main__'):
    if SCRAPE_URL == EVC_URL:
        DATA_FILE = "evc-" + BASE_DATA_FILE
        S3_SUBDIR = "addons/evc"
    elif SCRAPE_URL == EVO_URL:
        DATA_FILE = "evo-" + BASE_DATA_FILE
        S3_SUBDIR = "addons/evo"
    else:
        DATA_FILE = "evn-" + BASE_DATA_FILE
        S3_SUBDIR = "addons/evn"

    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    main()