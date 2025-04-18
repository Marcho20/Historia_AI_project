import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router, Routes, and Route
import Header from "./components/Header.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Modal from "./components/Modal.jsx";
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
        </Routes>

        {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>
    </Router>
  );
}

export default App;