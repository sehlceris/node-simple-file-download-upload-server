# Node.js File Upload and Download Server

This is a simple Node.js server that allows users to upload and download files using HTTP requests. The server stores uploaded files in a `www/` directory and serves them directly from the root route.

## Features
- **File Upload**: Upload files to the server using a `POST` request.
- **File Download**: Download files from the server using a `GET` request.
- **Dynamic IP Address Detection**: Automatically detects and uses the local IP address.
- **Port Fallback**: Starts the server on port 1337, or falls back to a random available port if 1337 is in use.

## Requirements
- Node.js (v14 or higher recommended)
- npm (v6 or higher)

## Running this Server

- Clone or download this repo
- `npm install`
- `npm start`

The server will start on port 1337 by default, or on a random available port if 1337 is occupied. The local IP address and port number will be displayed in the console.

## Upload a file:

You can upload a file using curl:

```shell
curl -X POST http://<your-ip-address>:<port>/upload -F 'file=@./file.tar'

# Example:
curl -X POST http://192.168.5.101:1337/upload -F 'file=@./file.tar'
```

## Download a file:

Download a file using wget:

```shell
wget http://<your-ip-address>:<port>/<filename>

# Example:
wget http://192.168.5.101:1337/file.tar
```