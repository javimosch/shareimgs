**ShareImgs**
================

ShareImgs is a Node.js app that allows friends to share images with each other after an event. The app provides a simple and convenient way to upload, view, and download images.

**Features**
------------

* **Simple Login**: Log in with a simple password to access the app
* **Multiple Image Upload**: Upload multiple images at once to share with friends
* **Gallery View**: View all uploaded images in a convenient gallery view
* **Download All**: Download all images at once with a single click

**How to Use**
--------------

### 1. Login

* Go to the app's login page and enter the shared password to log in.

### 2. Upload Images

* After logging in, click on the "Upload Images" button to select and upload multiple images to share with friends.

### 3. View Gallery

* View all uploaded images in the gallery view.
* Click on an image to view it in full size.

### 4. Download All

* Click on the "Download All" button to download all images at once.

**Environment Variables**
-----------------------

The app uses the following environment variables:

* `PORT`: The port number to use for the app (default: 3000)
* `PASSWORD`: The password to use for login (default: 'foo')
* `APPNAME`: The name of the app (default: 'App')

You can set these variables in a `.env` file or using the command line.

**Dependencies**
------------

The app uses the following dependencies:

* `express`: A Node.js web framework
* `multer`: A middleware for handling multipart/form-data requests
* `path`: A Node.js module for working with file paths
* `fs`: A Node.js module for working with the file system

**Technical Details**
--------------------

* Built with Node.js

**Running the App in Production with Docker**
-----------------------------------------

To run the app in production with Docker, use the following command:

```
docker-compose -f prod.yml up
```

This will start the app in a Docker container using the `javimosch/shareimgs` image. You can access the app by visiting `http://localhost:${PORT}` in your web browser.

**prod.yml File**
-----------------

The `prod.yml` file is used to define and run the app's Docker container in production. Here's a breakdown of the file:

* `version: '3'`: specifies the version of the `docker-compose` format
* `services`: defines a service named `app`
* `image: javimosch/shareimgs`: uses the `javimosch/shareimgs` Docker image
* `volumes: - .:/app`: mounts the current directory to `/app` inside the container
* `ports: - "${PORT}:${PORT}"`: maps the container's port to a host port (defined in the `.env` file)
* `env_file: - .env`: loads environment variables from the `.env` file
* `entrypoint: node`: sets the entrypoint to `node`
* `command: index.js`: runs the `index.js` file with Node.js

**License**
-------

ShareImgs is licensed under the [insert license type].

**Contributing**
------------

If you'd like to contribute to ShareImgs, please fork the repository and submit a pull request.

**Issues**
------

If you encounter any issues while using ShareImgs, please report them in the [issues](https://github.com/javimosch/shareimgs/issues) section.

**Author**
------

ShareImgs is developed and maintained by [Your Name].

**Repository**
-------------

The ShareImgs repository is available at: https://github.com/javimosch/shareimgs

**Star and Fork**
-------------

If you find ShareImgs useful, please consider starring and forking the repository to support the project!