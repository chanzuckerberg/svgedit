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



