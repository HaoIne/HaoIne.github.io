const http = require('http');
const fs = require('fs');
const path = require('path')
const marked = require('marked')

const server = http.createServer((req, res) => {
  // Build the path to the index.html file
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Get file extension to set Content-Type header
  const ext = path.extname(filePath).toLowerCase();

  if(ext === '.md') {
    // Read markdown file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if(err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('File Not Found');
      } else {
        // Convert markdown to HTML
        const html = marked(data);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
      }
    });
  } else {
    // Set a simple map for Content-Type
    const mimeTypes = {
      '.html': 'test/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.md': 'text/markdown',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
    };
  
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        // If error, send 500 response
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error loading file');
      } else {
        // Send the HTML file with content-type header
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content);
      }
    });
  } 
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});