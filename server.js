const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

// Root endpoint that returns "Hello, World!"
app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.send('Hello, World!\n');
});

// Evening endpoint that returns "Good evening"
app.get('/evening', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.send('Good evening');
});

console.log('hello world');
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});