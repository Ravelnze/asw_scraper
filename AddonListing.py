class AddonListing:
    def __init__(self, title, file_name, size, author, download_url, s3_url, content_type,
                    upload_date, category, votes, star_rating, download_count, body):
        self.title = title
        self.file_name = file_name
        self.size = size
        self.author = author
        self.download_url = download_url
        self.s3_url = s3_url
        self.content_type = content_type
        self.upload_date = upload_date
        self.category = category
        self.votes = votes
        self.star_rating = star_rating
        self.download_count = download_count
        self.body = body