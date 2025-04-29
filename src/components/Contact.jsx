import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions or need assistance? We're here to help!</p>
          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>support@historia-ai.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+63 921-123-4567</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Education Street, Learning City</span>
            </div>
          </div>
        </div>
        <div className="contact-form">
          <h2>Send us a Message</h2>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
