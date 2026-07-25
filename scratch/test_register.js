async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'ysuresh332@gmail.com',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('DATA:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
