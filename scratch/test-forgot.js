const axios = require('axios');

async function testForgotFlow() {
  try {
    // 1. Request Forgot Password
    console.log("Requesting forgot password...");
    await axios.post('https://chaos-planner-backend.onrender.com/api/auth/forgot-password', {
      email: 'testotp@chaos.dev'
    });
    console.log("Forgot password requested successfully.");

    // Note: We cannot get the OTP from the email because it's sent to the test email.
    // BUT we can test if the endpoint returns success!
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testForgotFlow();
