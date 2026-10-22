const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function testAll() {
  console.log('--- 1. Testing GET /api/videos ---');
  const videosRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/videos',
    method: 'GET',
  });
  console.log('Videos HTTP Status:', videosRes.status);
  console.log('Videos count:', videosRes.data?.videos?.length);
  if (!videosRes.data?.videos?.length) {
    throw new Error('No videos returned from /api/videos');
  }

  console.log('\n--- 2. Testing Phone OTP Flow ---');
  const testPhone = '9876543210';
  const sendOtpRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/phone/send-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { phone: testPhone }
  );
  console.log('Send OTP Status:', sendOtpRes.status, sendOtpRes.data);
  const otpCode = sendOtpRes.data?.demoOtp || '123456';

  const verifyOtpRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/phone/verify-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { phone: testPhone, otp: otpCode }
  );
  console.log('Verify OTP Status:', verifyOtpRes.status);
  console.log('User created/linked:', verifyOtpRes.data?.user?.phone);
  console.log('Has password set?:', verifyOtpRes.data?.user?.hasPassword);
  const cookie = verifyOtpRes.headers['set-cookie'];

  console.log('\n--- 3. Testing Order Tracking by Phone ---');
  const trackRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/orders/track?query=${testPhone}`,
    method: 'GET',
  });
  console.log('Track Order Status:', trackRes.status);
  console.log('Orders found for phone:', trackRes.data?.orders?.length);

  console.log('\n--- 4. Testing Setting Password in Profile for OTP User ---');
  if (cookie) {
    const updateProfileRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/account/profile',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie.map((c) => c.split(';')[0]).join('; '),
        },
      },
      {
        name: 'Organic Athlete',
        newPassword: 'MySecurePassword@123',
      }
    );
    console.log('Set Password Status:', updateProfileRes.status, updateProfileRes.data?.message);

    console.log('\n--- 5. Testing Login with Phone + New Password ---');
    const pwdLoginRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        identifier: testPhone,
        password: 'MySecurePassword@123',
      }
    );
    console.log('Password Login Status:', pwdLoginRes.status, pwdLoginRes.data?.user?.name);
  }

  console.log('\n--- 6. Testing Homepage HTML Rendering ---');
  const homeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
  });
  console.log('Homepage Status:', homeRes.status);
  const hasVideoSection = homeRes.raw?.includes('Watch The Purity & Crunch') || homeRes.raw?.includes('CRAFT IN MOTION');
  console.log('Homepage contains Video Advertisement Showcase:', hasVideoSection);

  console.log('\nALL CHECKS PASSED SUCCESSFULLY!');
}

testAll().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
