import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router, Routes, and Route
import Header from "./components/Header.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Modal from "./components/Modal.jsx";
 import AdminDashboard from './components/AdminDashboard';

import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Initially set to false

  const openModal = () => {
    setIsModalOpen(true); // Function to open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Function to close the modal
  };

  return (
    <Router>
      <div className="App">
      <Header onLoginClick={openModal} />        
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>

        {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>
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