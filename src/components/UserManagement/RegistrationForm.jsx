import React, { useState } from 'react';
import './RegistrationForm.css';
import { registerWithEmailAndPassword, verifyCode } from '../../firebase/firebase';
import { toast } from 'react-toastify';

export const RegistrationForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [verificationCode, setVerificationCode] = useState('');
  const [demoCode, setDemoCode] = useState(''); // For displaying the code in development

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate role selection
      if (!formData.role) {
        toast.error('Please select a role (Teacher or Student)');
        setIsLoading(false);
        return;
      }

      // Register user with Firebase and send verification code
      const result = await registerWithEmailAndPassword(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );
      
      // Get the verification code directly from the result
      if (result && result.verificationResult && result.verificationResult.code) {
        setDemoCode(result.verificationResult.code);
        toast.success('Registration successful! Enter the 6-digit code shown below.');
        
        // Note: We don't call onUserAdded here anymore.
        // The user will be added to the UI through the real-time subscription
        // when they verify their account.
      } else {
        // Fallback to console log extraction if needed
        const originalConsoleLog = console.log;
        let capturedCode = '';
        console.log = function(message) {
          originalConsoleLog.apply(console, arguments);
          if (typeof message === 'string' && message.includes('VERIFICATION CODE:')) {
            capturedCode = message.split('VERIFICATION CODE:')[1].trim();
            setDemoCode(capturedCode);
          }
        };
        
        // Restore console.log after a short delay
        setTimeout(() => {
          console.log = originalConsoleLog;
          if (!demoCode && capturedCode) {
            setDemoCode(capturedCode);
          }
        }, 500);
        
        toast.success('Registration successful! Enter the 6-digit code shown below.');
      }
      
      setStep('verify');
    } catch (error) {
      console.error('Error in registration process:', error);
      toast.error('Registration error: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(`Attempting to verify code for email: ${formData.email}, code: ${verificationCode}`);
      
      // Make sure we're using the same email that was used for registration
      const result = await verifyCode(formData.email, verificationCode);
      
      if (result.success) {
        toast.success('Verification successful! User is now active.');
        
        // We don't need to create a new user object here
        // The user status has been updated in Firestore and will be reflected
        // in the UI through the real-time subscription
        
        // Just close the modal
        if (onClose) onClose();
      } else {
        toast.error('Verification failed. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Verification error details:', error);
      
      // Provide more specific error messages based on the error
      if (error.message.includes('No verification code found')) {
        toast.error('No verification code found. Please try registering again.');
      } else if (error.message.includes('expired')) {
        toast.error('Verification code has expired. Please register again to get a new code.');
      } else if (error.message.includes('Invalid verification code')) {
        toast.error('Invalid code. Please check and try again.');
      } else {
        toast.error('Verification error: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // No longer needed: verification step is handled by email link. Remove handleSubmit.

  return (
    <div className="registration-form">
      <h2>Add New Member</h2>
      {step === 'register' && (
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              style={{ padding: '10px 14px', fontSize: '16px', height: 'auto' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              style={{ padding: '10px 14px', fontSize: '16px', height: 'auto' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              minLength={6}
              style={{ padding: '10px 14px', fontSize: '16px', height: 'auto' }}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-button ${formData.role === 'teacher' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'teacher'})}
                style={{ padding: '10px 14px', fontSize: '16px', height: 'auto' }}
              >
                Teacher
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'student' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'student'})}
                style={{ padding: '10px 14px', fontSize: '16px', height: 'auto' }}
              >
                Student
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              style={{ padding: '10px 18px', fontSize: '16px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!formData.email || !formData.fullName || !formData.password || !formData.role || isLoading}
              style={{ padding: '10px 18px', fontSize: '16px' }}
            >
              Register
            </button>
          </div>
        </form>
      )}
      {step === 'verify' && (
        <form onSubmit={handleVerify}>
          {demoCode && (
            <div className="demo-code-container">
              <h3>VERIFICATION CODE</h3>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {demoCode.split('').map((digit, index) => (
                  <div key={index} style={{
                    width: '45px',
                    height: '55px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    margin: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: '#333',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
                    border: '1px solid #e0e0e0'
                  }}>
                    {digit}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(demoCode);
                  toast.info('Verification code copied to clipboard!');
                }}
                style={{
                  backgroundColor: '#4361ee',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  margin: '0 0 15px 0',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 3px 8px rgba(67, 97, 238, 0.2)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a56d4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4361ee'}
              >
                Copy Code
              </button>
              <p style={{ fontSize: '15px', color: '#666', margin: '0' }}>
                Enter this code below to complete your registration
              </p>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="verificationCode" style={{ marginBottom: '10px', fontSize: '17px' }}>Enter Verification Code *</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              placeholder="6-digit code"
              required
              maxLength={6}
              minLength={6}
              pattern="[0-9]{6}"
              autoFocus
              style={{ padding: '12px 16px', fontSize: '17px' }}
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              style={{ padding: '10px 18px', fontSize: '16px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!verificationCode || verificationCode.length !== 6 || isLoading}
              style={{ padding: '10px 18px', fontSize: '16px' }}
            >
              Verify
            </button>
          </div>
        </form>
      )}
      <div className="info-message" style={{marginTop: '1.2rem', color: '#555', fontSize: '1.05em'}}>
        {step === 'register' && <p>After registration, you will receive a verification code in your email. Please enter it below to activate your account.</p>}
        {step === 'verify' && <p>Please check your email and enter the 6-digit code to complete registration.</p>}
      </div>
    </div>
  );
}; 