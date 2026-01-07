// Simulate OTP generation (in production, integrate with SMS service like Twilio)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Simulate OTP sending (log to console for now)
const sendOTP = (phone, otp) => {
  console.log(`OTP for ${phone}: ${otp}`);
  // In production: integrate with SMS API
  return Promise.resolve();
};

module.exports = { generateOTP, sendOTP };