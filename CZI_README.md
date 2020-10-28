## About

This repository forked from https://github.com/SVG-Edit/svgedit, 
It contains branch with custom UI and features that are not available in the original repository.

## Development Flow

The flow is for developing locally from your computer so you could test the embedded editor that use cross-domain communication between http://127.0.0.1 and http://localhost. 

```
# Get the repository and enter the project folder
git clone https://github.com/chanzuckerberg/svgedit

# Enter the project folder
cd svgedit

# Install dependencies
npm install

# Start the web server
npm run start-allow-origin
```

Point your web browser to http://127.0.0.1:8001/dist/editor/test-xdomain.html

## Deployment Flow

The flow is for deploying build files to S3

```
# generate files at dist directory
npm build

# copy files to S3
# `your_s3_location_key` should be replaced by something like `your_bucket_name/your_s3_key`
aws s3 cp dist/editor s3://<your_s3_location_key> --recursive --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

```

Go to your S3 Admin console, make sure that these files are public.





