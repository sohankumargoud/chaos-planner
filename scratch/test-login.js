async function test() {
  try {
    console.log('Logging in to OnRender...');
    const loginRes = await fetch('https://chaos-planner-backend.onrender.com/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@chaos.dev',
        password: 'Admin@123'
      })
    });
    
    const loginData = await loginRes.json();
    console.log('Login Response keys:', Object.keys(loginData));
    const token = loginData.token;
    console.log('Token starts with:', token ? token.substring(0, 10) : 'MISSING');

    console.log('Fetching dashboard...');
    const dashRes = await fetch('https://chaos-planner-backend.onrender.com/api/admin/analytics/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Dashboard Status:', dashRes.status);
    if (!dashRes.ok) {
       console.log('Error payload:', await dashRes.text());
    } else {
       console.log('Dashboard Success!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
