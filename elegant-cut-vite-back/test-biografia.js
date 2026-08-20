const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id_usuario: 3, email: 'admin@elegantcut.com', id_rol: 1 }, 'elegantcut_super_secret_jwt_key_2024', { expiresIn: '1h' });

const data = JSON.stringify({
  id_usuario: 3,
  biografia: "",
  experiencia: "",
  instagram: ""
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/portabarbero',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Cookie': `jwt=${token}`
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
