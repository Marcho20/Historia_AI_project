import React from 'react';
import './Home.css';
import logo from '../assets/berean-logo.png';

const Home = () => {
    return (
        <div className="home-container">
            <div className="center-logo">
                <img src={logo} alt="Berean Logo" className="berean-logo" />
            </div>
        </div>
    );
};

export default Home; 