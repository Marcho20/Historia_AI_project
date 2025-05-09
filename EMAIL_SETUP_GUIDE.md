# Setting Up Email Verification for Historia AI

## Overview
This guide will help you set up real email sending for your verification codes in the Historia AI education platform. This will allow verification codes to be sent to actual Gmail accounts during the registration process.

## Option 1: Using EmailJS (Recommended for Development)

EmailJS allows you to send emails directly from client-side JavaScript without needing a backend server. This is perfect for development and testing.

### Step 1: Create an EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for a free account
2. Verify your email address

### Step 2: Connect Your Gmail Account
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service" and select "Gmail"
3. Follow the instructions to connect your Gmail account
4. Note down the **Service ID** that is generated

### Step 3: Create an Email Template
1. Go to "Email Templates" in your EmailJS dashboard
2. Click "Create New Template"
3. Use the HTML template we've provided in `src/services/emailTemplate.html`
4. In the template, make sure you have the following variables:
   - `{{to_name}}` - The recipient's name
   - `{{to_email}}` - The recipient's email
   - `{{verification_code}}` - The 6-digit verification code
   - `{{from_name}}` - The sender's name (Historia AI)
5. Save the template and note down the **Template ID**

### Step 4: Update Your EmailJS Configuration
1. Open `src/services/emailService.js`
2. Update the following constants with your actual values:
   ```javascript
   const USER_ID = 'YOUR_USER_ID'; // Your EmailJS User ID
   const SERVICE_ID = 'YOUR_SERVICE_ID'; // Your Gmail service ID
   const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Your email template ID
   ```

### Step 5: Enable Real Email Sending
1. Open `src/firebase/firebase.js`
2. Find the `sendVerificationCode` function
3. Uncomment the line:
   ```javascript
   // await sendVerificationEmail(email, fullName, verificationCode);
   ```
   and comment out the line:
   ```javascript
   const result = logVerificationCode(email, fullName, verificationCode);
   ```

## Option 2: Using Firebase Cloud Functions (For Production)

For a production environment, you should use Firebase Cloud Functions with Nodemailer to send emails.

### Step 1: Set Up Firebase Cloud Functions
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase Functions: `firebase init functions`
3. Navigate to the functions directory: `cd functions`

### Step 2: Install Nodemailer
```bash
npm install nodemailer --save
```

### Step 3: Create an Email Sending Function
Create a function in `functions/index.js` that sends emails using Nodemailer:

```javascript
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
```

### Step 4: Deploy Your Cloud Functions
```bash
firebase deploy --only functions
```

### Step 5: Update Your Firebase.js File
Modify your `src/firebase/firebase.js` file to use the cloud functions instead of the client-side implementation.

## Important Notes

1. **Gmail Security**: If you're using Gmail, you'll need to:
   - Enable "Less secure app access" OR
   - Use an "App Password" if you have 2-factor authentication enabled

2. **Email Sending Limits**:
   - EmailJS free tier: 200 emails/month
   - Gmail: 500 emails/day

3. **Testing**:
   - Always test with your own email address first
   - Check your spam folder if you don't see the verification email

4. **Production Considerations**:
   - For a production app, consider using a dedicated email service like SendGrid, Mailgun, or Amazon SES
   - These services offer better deliverability and higher sending limits

## Troubleshooting

- **Emails not arriving**: Check spam folders and ensure your email service is properly configured
- **SMTP errors**: Make sure your email credentials are correct
- **Cloud Function errors**: Check Firebase console logs for detailed error messages
