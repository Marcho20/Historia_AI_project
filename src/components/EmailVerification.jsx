import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleEmailVerification } from '../firebase/firebase';
import { toast } from 'react-toastify';
import './EmailVerification.css';
import bereanLogo from "../assets/logo1.jpg";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // 4  (verification code) from oobcodd
        const queryParams = new URLSearchParams(location.search);
        const oobCode = queryParams.get('oobCode');
        
        if (!oobCode) {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link. Please request a new one.');
          return;
        }

        // 4 t Process the verification
        const result = await handleEmailVerification(oobCode);
        
        if (result.success) {
          setVerificationStatus('success');
          toast.success('Email verified successfully!');
        } else {
          setVerificationStatus('error');
          setErrorMessage('Verification failed. Please try again or contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'An error occurred during verification');
      }
    };

    verifyEmail();
  }, [location]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="email-verification-container">
      <div className="email-verification-card">
        <div className="logo-container">
          <img src={bereanLogo} alt="Historia AI Logo" className="logo" />
        </div>
        
        <h2>Email Verification</h2>
        
        {verificationStatus === 'verifying' && (
          <div className="verification-status verifying">
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="verification-status success">
            <div className="success-icon">✓</div>
            <p>Your email has been verified successfully!</p>
            <p>Your account is now active.</p>
            <button className="login-button" onClick={handleGoToLogin}>
              Go to Login
            </button>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="verification-status error">
            <div className="error-icon">✗</div>
            <p>Verification failed</p>
            <p className="error-message">{errorMessage}</p>
            <button className="login-button" onClick={handleGoToLogin}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
