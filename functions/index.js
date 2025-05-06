const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-app-password' // Use an app password, not your regular password
  }
});

exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
  const { email, fullName } = data;
  
  // Generate a 6-digit code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store the code in Firestore
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);
  
  await admin.firestore().collection('verificationCodes').doc(email).set({
    code: verificationCode,
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    attempts: 0
  });
  
  // Send the email
  const mailOptions = {
    from: 'Historia AI <your-email@gmail.com>',
    to: email,
    subject: 'Your Historia AI Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4a69bd; color: white; padding: 20px; text-align: center;">
          <h1>Historia AI</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Hello ${fullName},</p>
          <p>Thank you for registering with Historia AI. Please use the following verification code to complete your registration:</p>
          
          <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4a69bd;">${verificationCode}</div>
          </div>
          
          <p>This code will expire in 30 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
          <p>© 2025 Historia AI. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending email');
  }
});

// Function to verify the code
exports.verifyCode = functions.https.onCall(async (data, context) => {
  const { email, code } = data;
  
  try {
    const codeDoc = await admin.firestore().collection('verificationCodes').doc(email).get();
    
    if (!codeDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'No verification code found');
    }
    
    const codeData = codeDoc.data();
    
    // Check if code is expired
    if (codeData.expiresAt.toDate() < new Date()) {
      await admin.firestore().collection('verificationCodes').doc(email).delete();
      throw new functions.https.HttpsError('deadline-exceeded', 'Verification code expired');
    }
    
    // Update attempts
    await admin.firestore().collection('verificationCodes').doc(email).update({
      attempts: codeData.attempts + 1
    });
    
    // Check if code matches
    if (codeData.code !== code) {
      // If too many attempts (5+), invalidate the code
      if (codeData.attempts >= 4) {
        await admin.firestore().collection('verificationCodes').doc(email).delete();
        throw new functions.https.HttpsError('permission-denied', 'Too many failed attempts');
      }
      
      throw new functions.https.HttpsError('invalid-argument', 'Invalid verification code');
    }
    
    // Code is valid, delete it from Firestore (one-time use)
    await admin.firestore().collection('verificationCodes').doc(email).delete();
    
    // Update user status to Active
    const usersSnapshot = await admin.firestore().collection('users')
      .where('email', '==', email)
      .get();
    
    if (!usersSnapshot.empty) {
      await admin.firestore().collection('users').doc(usersSnapshot.docs[0].id).update({
        status: 'Active',
        lastSeen: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error verifying code:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});