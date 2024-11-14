import React from "react"; // Import React to use JSX syntax
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import React Router components
import "./App.css"; // Import CSS styles
import Auth from "./pages/auth/Auth"; // Import Auth component
import Home from "./pages/Home"; // Assuming you have a Home page component
import "./assets/styles/main.scss"; // Import global styles from SCSS

function App() {
  return (
    <Router>
      {" "}
      {/* Wrap the app in BrowserRouter */}
      <div className="content-container flex">
        <Routes>
          {" "}
          {/* Define the Routes for different paths */}
          {/* Route for the Auth component */}
          <Route path="/" element={<Auth />} />
          {/* Route for the Home page */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
