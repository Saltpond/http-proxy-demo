
const http = require('http');
const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

const port = 3000;
const allowIps = [
  '127.0.0.1',
];

proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log(`proxy to ${req.headers['target-host']}${req.url} success`);
});

proxy.on('error', (err, req, res) => {
  console.error(err);
  res.statusCode = 500;
  res.end('Internal Sever Error');
});

const server = http.createServer((req, res) => {
  const host = req.headers['target-host'];
  const ip = getRequestIP(req);

  if (!host || !allowIps.includes(ip)) {
    res.statusCode = 404;
    res.end('Not Fount');
    return;
  }

  proxy.web(req, res, { target: host });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`proxy serer listen on port: ${port}`);
});

function getRequestIP(req) {
  const ipArr = req.connection.remoteAddress.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
  return (ipArr && ipArr.length > 0) ? ipArr[0] : '127.0.0.1';
}
