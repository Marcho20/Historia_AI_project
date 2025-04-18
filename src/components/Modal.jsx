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






// import React, { useState } from "react";
// import { FaUser } from "react-icons/fa";
// import { IoLockClosed } from "react-icons/io5";
// import { IoClose } from "react-icons/io5";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
// import "./Modal.css";
// import bereanLogo from "../assets/logo1.jpg";

// function Modal({ onClose }) {
//   const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

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
//                 <img src={bereanLogo} alt="Historia AI Logo" className="login-logo" />
//               </div>
//               <div className="login-right">
//                 <h2 className="login-title">LOGIN FORM</h2>
//                 <form>
//                   <div className="mb-4">
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         <FaUser className="input-icon" />
//                       </span>
//                       <input 
//                         type="text" 
//                         className="form-control" 
//                         placeholder="Enter Username" 
//                         name="username" 
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         <IoLockClosed className="input-icon" />
//                       </span>
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         className="form-control"
//                         placeholder="Enter your Password"
//                         name="password"
//                       />
//                       <button
//                         type="button"
//                         className="password-toggle"
//                         onClick={togglePasswordVisibility}
//                       >
//                         {showPassword ? (
//                          <FaEye className="password-icon" /> 
//                         ) : (
//                           <FaEyeSlash className="password-icon" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <button type="submit" className="btn btn-signin w-100">
//                     Sign In →
//                   </button>
//                   {/* <div className="forgot-password mt-3 text-center"> */}
//                     {/* <a href="#">
//                       Forgot your password? <span>Click here</span>
//                     </a> */}
//                   {/* </div> */}
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




// import React, { useState } from "react";
// import { FaUser } from "react-icons/fa";
// import { IoLockClosed, IoClose } from "react-icons/io5";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import LoginSelection from "./LoginSelection";
// import "./Modal.css";
// import bereanLogo from "../assets/logo1.jpg";

// function Modal({ onClose }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleRoleSelect = (role) => {
//     setSelectedRole(role);
//   };

//   return (
//     <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <button className="modal-close-btn" onClick={onClose}>
//             <IoClose size={24} />
//           </button>
//           <div className="modal-body p-0">
//             {!selectedRole ? (
//               <LoginSelection onSelectRole={handleRoleSelect} />
//             ) : (
//               <div className="login-container">
//                 <div className="login-left">
//                   <img src={bereanLogo} alt="Historia AI Logo" className="login-logo" />
//                 </div>
//                 <div className="login-right">
//                   <h2 className="login-title">
//                     {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login
//                   </h2>
//                   <form>
//                     <div className="mb-4">
//                       <div className="input-group">
//                         <span className="input-group-text">
//                           <FaUser className="input-icon" />
//                         </span>
//                         <input 
//                           type="text" 
//                           className="form-control" 
//                           placeholder={`Enter ${selectedRole} username`}
//                           name="username" 
//                         />
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <div className="input-group">
//                         <span className="input-group-text">
//                           <IoLockClosed className="input-icon" />
//                         </span>
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           className="form-control"
//                           placeholder="Enter your Password"
//                           name="password"
//                         />
//                         <button
//                           type="button"
//                           className="password-toggle"
//                           onClick={togglePasswordVisibility}
//                         >
//                           {showPassword ? (
//                             <FaEyeSlash className="password-icon" />
//                           ) : (
//                             <FaEye className="password-icon" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                     <button type="submit" className="btn btn-signin w-100">
//                       Sign In →
//                     </button>
//                     <div className="forgot-password mt-3 text-center">
//                       <a href="#">
//                         Forgot your password? <span>Click here</span>
//                       </a>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Modal;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { FaUser } from "react-icons/fa";
import { IoLockClosed, IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoginSelection from "./LoginSelection";
import "./Modal.css";
import bereanLogo from "../assets/logo1.jpg";
import { toast, ToastContainer } from 'react-toastify'; // Import for notifications
import 'react-toastify/dist/ReactToastify.css';

function Modal({ onClose }) {


  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Sample user credentials (in a real app, this would come from a backend)
  const userCredentials = {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    teacher: { username: 'teacher', password: 'teacher123', role: 'teacher' },
    student: { username: 'student', password: 'student123', role: 'student' }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check credentials based on role
    const userCred = userCredentials[selectedRole];
    
    if (formData.username === userCred.username && formData.password === userCred.password) {
      // Successful login
      toast.success('Login successful!');
      
      // Store user info in localStorage (you might want to use a more secure method in production)
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        role: selectedRole
      }));

      // Close modal and navigate to dashboard
      setTimeout(() => {
        onClose();
        navigate(`/${selectedRole}-dashboard`);
      }, 1500);
    } else {
      // Failed login
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
          <div className="modal-body p-0">
            {!selectedRole ? (
              <LoginSelection onSelectRole={handleRoleSelect} />
            ) : (
              <div className="login-container">
                <div className="login-left">
                  <img src={bereanLogo} alt="Historia AI Logo" className="login-logo" />
                </div>
                <div className="login-right">
                  <h2 className="login-title">
                    {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser className="input-icon" />
                        </span>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder={`Enter ${selectedRole} username`}
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
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
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="password-icon" />
                          ) : (
                            <FaEye className="password-icon" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-signin w-100">
                      Sign In →
                    </button>
                    <div className="forgot-password mt-3 text-center">
                      <a href="#">
                        Forgot your password? <span>Click here</span>
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>




  );
}

export default Modal;