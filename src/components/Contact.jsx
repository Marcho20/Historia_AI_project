import React from 'react';
import './Contact.css';
import { FaEnvelope, FaPhone, FaQuestionCircle, FaBook } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="help-container">
      <div className="help-content">
        <h1>Help Center</h1>
        
        <div className="help-grid">
          <div className="help-card">
            <div className="help-icon">
              <FaQuestionCircle />
            </div>
            <h2>FAQs</h2>
            <ul>
              <li>How do I get started with HISTORIA: AI?</li>
              <li>What features are available?</li>
              <li>How do I track my progress?</li>
              <li>Can I customize my learning path?</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon">
              <FaBook />
            </div>
            <h2>User Guide</h2>
            <ul>
              <li>Platform navigation tutorial</li>
              <li>Using AI features effectively</li>
              <li>Accessing learning resources</li>
              <li>Managing your account</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon">
              <FaEnvelope />
            </div>
            <h2>Contact Support</h2>
            <p>Email: support@historia-ai.com</p>
            <p>Response time: Within 24 hours</p>
            <button className="contact-button">Send Message</button>
          </div>

          <div className="help-card">
            <div className="help-icon">
              <FaPhone />
            </div>
            <h2>Technical Support</h2>
            <p>Available Monday - Friday</p>
            <p>9:00 AM - 5:00 PM EST</p>
            <button className="contact-button">Call Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
