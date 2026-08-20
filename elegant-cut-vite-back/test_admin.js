async function test() {
  try {
    const response = await fetch('http://localhost:3001/api/admin/administrators/85', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testadmin2_updated',
        prim_nombre: 'Test Updated'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
