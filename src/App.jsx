import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // Import Router, Routes, Route, and useLocation
import Header from "./components/Header.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Modal from "./components/Modal.jsx";
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from "./components/TeacherSection/TeachearDashboard";// import UserList from './components/UserManagement/UserList';
// import Home from './components/Home';
import StudentDashboard from './components/StudentAreaSection/StudentDashboard';
import EmailVerification from './components/EmailVerification';

import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Wrapper component to apply background based on route
function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  
  // Apply home-bg class only when on home page (root path)
  const isHomePage = location.pathname === '/' || location.pathname === '';
  const bgClass = isHomePage ? 'home-bg' : '';

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`App ${bgClass}`}>
      <Header onLoginClick={openModal} />        
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>

      {isModalOpen && <Modal onClose={handleCloseModal} />}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from "./components/Header";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import Modal from "./components/Modal";
// import AdminDashboard from './components/AdminDashboard';
// import TeacherDashboard from './components/ProtectedRoute';
// import StudentDashboard from './components/StudentDashboard';
// import Home from './components/Home';
// import './App.css';

// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Header onLoginClick={openModal} />        
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />
//           <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
//           <Route path="/student-dashboard" element={<StudentDashboard />} />
//         </Routes>

//         {isModalOpen && <Modal onClose={handleCloseModal} />}
//       </div>
//     </Router>
//   );
// }

// export default App;