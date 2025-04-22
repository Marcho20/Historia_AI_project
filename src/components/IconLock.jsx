import React, { useState } from 'react';
import './IconLock.css';
import { FaLock, FaLockOpen, FaUser } from 'react-icons/fa';

const IconLock = ({ onLockChange }) => {
  const [isLocked, setIsLocked] = useState(true);

  const handleClick = () => {
    setIsLocked(!isLocked);
    if (onLockChange) {
      onLockChange(!isLocked);
    }
  };

  return (
    <div className="icon-lock-container">
      <div className={`icon-lock-item ${isLocked ? 'locked' : 'unlocked'}`} onClick={handleClick}>
        <div className="lock-icon">
          {isLocked ? <FaLock /> : <FaLockOpen />}
        </div>
        <div className="user-icon">
          <FaUser />
        </div>
        <div className="menu-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default IconLock; 