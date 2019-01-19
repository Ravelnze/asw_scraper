# asw_scraper

Just a little project to help preserve the community made plugins for the Escape Velocity series of games by Ambrosia Software.

Two components: 
  - python 
    - scrapes through the ambrosia website and collects metadata and streams all the downloadable files through to an S3 bucket, this requires configuration of AWS settings to environment variables as well as changing the bucket name to one that is accessible.

  - react
    - a simple little website to host the various files and data with search and filter options.

Site is hosted at: https://ev.appcraft.name/
