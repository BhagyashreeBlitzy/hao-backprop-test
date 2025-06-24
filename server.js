const express = require('express');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Define specific route handler for '/good-evening' endpoint
app.get('/good-evening', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.send('Good evening\n');
});

// Define catch-all route handler for all other paths
app.get('*', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.send('Hello world\n');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
