// import React from "react";
// // import React, { useState, useEffect } from "react";
// import { FaUser } from "react-icons/fa";
// import { IoLockClosed } from "react-icons/io5";
// import { IoClose } from "react-icons/io5";
// import "./Modal.css";
// import bereanLogo from "../assets/logo1.jpg";

// function Modal({ onClose }) {
//   return (
 
//     <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <button className="modal-close-btn" onClick={onClose}>
//             <IoClose size={24} />
//           </button>
//           <div className="modal-body p-0">
//             <div className="login-container">
//               <div className="login-left">
//                 <div className="login-logo-container">
//                   <img src={bereanLogo} alt="Historia AI Logo" className="login-logo" />
//                 </div>
//               </div>
//               <div className="login-right">
//                 <h2 className="login-title">LOGIN FORM</h2>
//                 <form>
//                   <div className="mb-4">
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         <FaUser className="input-icon" />
//                       </span>
//                       <input type="text" className="form-control" id="username" placeholder="Enter Username" name="username" />
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         <IoLockClosed className="input-icon" />
//                       </span>
//                       <input type="password" className="form-control" id="password" placeholder="Enter your Password" name="password" />
//                     </div>
//                   </div>
//                   <button type="submit" className="btn btn-signin w-100">Sign In →</button>
//                   <div className="forgot-password mt-3 text-center">
//                     <a href="#">Forgot your password? <span>Click here</span></a>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default Modal;






import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLockClosed } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./Modal.css";
import bereanLogo from "../assets/logo1.jpg";

function Modal({ onClose }) {
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
          <div className="modal-body p-0">
            <div className="login-container">
              <div className="login-left">
                <img src={bereanLogo} alt="Historia AI Logo" className="login-logo" />
              </div>
              <div className="login-right">
                <h2 className="login-title">LOGIN FORM</h2>
                <form>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser className="input-icon" />
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Username" 
                        name="username" 
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <IoLockClosed className="input-icon" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your Password"
                        name="password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                         <FaEye className="password-icon" /> 
                        ) : (
                          <FaEyeSlash className="password-icon" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-signin w-100">
                    Sign In →
                  </button>
                  {/* <div className="forgot-password mt-3 text-center"> */}
                    {/* <a href="#">
                      Forgot your password? <span>Click here</span>
                    </a> */}
                  {/* </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;