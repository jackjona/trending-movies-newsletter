# Hono Proxy

A Hono app that proxies requests to a specified origin server.

## Usage Example

To proxy a file located at: `https://origin.example.com/api/file.zip` (https://origin.example.com being the origin server) this app will allow you to proxy the file using
`http://localhost:8787?origin=https://origin.example.com/api/file.zip`(http://localhost:8787 being this app)

## Features

- Domain Whitelisting: Only allow proxy requests from specified allowed origins
- HTTPS Protocol Verification: Only allows HTTPS origin URLs
- Partial and Full Responses: Sends either a full or partial response depending on whether the Range header is present.
- Resume interrupted downloads
- Lightweight

## To Develop Locally

To run:

```
npm install
npm run dev
```

To deploy:

```
npm run deploy
```
