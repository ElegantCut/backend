const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign({ id_usuario: 3, email: 'admin@elegantcut.com', id_rol: 1 }, 'elegantcut_super_secret_jwt_key_2024', { expiresIn: '1h' });

  const response = await fetch('http://localhost:3001/api/barbers/3', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ biografia: "" })
  });

  const data = await response.text();
  console.log(response.status);
  console.log(data);
}
test();
