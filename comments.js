// Create web server
// 1. Create a new web server
// 2. Handle requests and responses
// 3. Listen for incoming requests
// 4. Parse the request body
// 5. Get the comments
// 6. Save the new comment
// 7. Send a response
// 8. Serve static files

// 1. Create a new web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments');

// 2. Handle requests and responses
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  let filePath = '.' + reqUrl.pathname;

  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        fs.readFile('./404.html', (err, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });

  // 4. Parse the request body
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newComment = JSON.parse(body);
      comments.push(newComment);

      res.end(JSON.stringify(comments));
    });
  }

  // 5. Get the comments
  if (reqUrl.pathname ===