import { init, send } from 'emailjs-com';

// Initialize EmailJS with your user ID
// You'll need to sign up at https://www.emailjs.com/ and get your User ID
const USER_ID = 'YOUR_USER_ID'; // Replace with your actual User ID
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID

// Initialize EmailJS
init(USER_ID);

/**
 * Send verification code email
 * @param {string} email - Recipient email
 * @param {string} fullName - Recipient name
 * @param {string} verificationCode - The verification code
 * @returns {Promise} - Promise resolving to the EmailJS response
 */
// export const sendVerificationEmail = async (email, fullName, verificationCode) => {
//   try {
//     const templateParams = {
//       to_email: email,
//       to_name: fullName,
//       verification_code: verificationCode,
//       from_name: 'Historia AI'
//     };
    
//     const response = await send(SERVICE_ID, TEMPLATE_ID, templateParams);
//     console.log('Email sent successfully:', response);
//     return { success: true, response };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

/**
 * For development: Log verification code instead of sending email
 * @param {string} email - Recipient email
 * @param {string} fullName - Recipient name
 * @param {string} verificationCode - The verification code
 * @returns {Object} - Success status and the code
 */
export const logVerificationCode = (email, fullName, verificationCode) => {
  console.log('===================================');
  console.log(`VERIFICATION CODE: ${verificationCode}`);
  console.log(`For user: ${email} (${fullName})`);
  console.log('===================================');
  
  return { success: true, code: verificationCode };
};
