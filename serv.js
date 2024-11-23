//import { createServer } from 'node:http';
var {createServer}=require('http');
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});
// starts a simple http server locally on port 3000
server.listen(80, () => {
  console.log('Listening on chatikon.ru');
});
