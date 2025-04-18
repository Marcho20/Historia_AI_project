// import React from "react";
// import "./Header.css";
// import logo1 from "../assets/logo1.jpg";
// import { NavLink } from "react-router-dom";

// function Header({ onLoginClick }) {
//     return (
//       <>
//         <header>
//             <div className="logo">
//                 <img src={logo1} alt="Logo" className="header-logo" />
//                 <h2>HISTORIA: AI</h2>
//             </div>  
//             <nav> 
//                 <ul>
//                     <li>
//                         <NavLink
//                             to="/about"
//                             className={({ isActive }) => (isActive ? "active" : "")}
//                         >
//                             About
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink
//                             to="/contact"
//                             className={({ isActive }) => (isActive ? "active" : "")}
//                         >
//                             Help
//                         </NavLink>
//                     </li>
//                     {/* <li> */}
//                     <li>
//             <button className="login-button" onClick={onLoginClick}>
//               Login
//             </button>
//                     </li>
//                 </ul> 
//             </nav>
//         </header>
//         <div className="center-logo-container"></div>

//            </>
//     );
// }

// export default Header;


// import React from "react";
// import "./Header.css";
// import logo1 from "../assets/logo1.jpg";
// import { NavLink, useLocation } from "react-router-dom";

// function Header({ onLoginClick }) {
//     const location = useLocation();
//     const isInDashboard = location.pathname.includes('dashboard');

//     return (
//       <>
//         <header>
//             <div className="logo">
//                 <img src={logo1} alt="Logo" className="header-logo" />
//                 <h2>HISTORIA: AI</h2>
//             </div>  
//             {!isInDashboard && (
//               <nav> 
//                   <ul>
//                       <li>
//                           <NavLink
//                               to="/about"
//                               className={({ isActive }) => (isActive ? "active" : "")}
//                           >
//                               About
//                           </NavLink>
//                       </li>
//                       <li>
//                           <NavLink
//                               to="/contact"
//                               className={({ isActive }) => (isActive ? "active" : "")}
//                           >
//                               Help
//                           </NavLink>
//                       </li>
//                       <li>
//                           <button className="login-button" onClick={onLoginClick}>
//                             Login
//                           </button>
//                       </li>
//                   </ul> 
//               </nav>
//             )}
//         </header>
//         <div className="center-logo-container"></div>
//       </>
//     );
// }

// export default Header;


import React from "react";
import "./Header.css";
import logo1 from "../assets/logo1.jpg";
import { NavLink, useLocation } from "react-router-dom";

function Header({ onLoginClick }) {
    const location = useLocation();
    const isInDashboard = location.pathname.includes('dashboard');

    return (
      <>
        <header>
            <div className="logo">
                {!isInDashboard && <img src={logo1} alt="Logo" className="header-logo" />}
                <h2>HISTORIA: AI</h2>
            </div>  
            {!isInDashboard && (
                <nav> 
                    <ul>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Help
                            </NavLink>
                        </li>
                        <li>
                            <button className="login-button" onClick={onLoginClick}>
                              Login
                            </button>
                        </li>
                    </ul> 
                </nav>
            )}
        </header>
        <div className="center-logo-container"></div>
      </>
    );
}

export default Header;