const http = require('http');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'admin@elegantcut.com', role: 1 }, 'your-secret-key-change-in-production', { expiresIn: '1h' });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/dashboard/stats/pdf',
  method: 'GET',
  headers: {
    'Cookie': `jwt=${token}`
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  const file = fs.createWriteStream('test.pdf');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
