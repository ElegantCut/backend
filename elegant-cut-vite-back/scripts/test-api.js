
const http = require('http');

http.get('http://localhost:3001/api/barbers', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('API Response Sample (Barber 0):');
      if (json.length > 0) {
        console.log(JSON.stringify(json[0], null, 2));
        const b3 = json.find(b => b.id_usuario === 3);
        if (b3) {
            console.log('Barber 3 (Daniel) details:');
            console.log(JSON.stringify(b3.portafolios[0], null, 2));
        }
      } else {
          console.log('Empty response array');
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
