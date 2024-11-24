import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./pages/auth/Auth"; // Import Auth component
import Dashboard from "./pages/Dashboard"; // Import Dashboard component
import "./assets/styles/main.scss"; // Import global styles from SCSS
import { Toaster } from "react-hot-toast";

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track auth status
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          }
        );

        if (res.ok) {
          // If the response is OK, set authenticated state to true
          setIsAuthenticated(true);
        } else {
          // If the response is not OK, set authenticated state to false
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false); // If there's an error, treat as not authenticated
      } finally {
        setIsLoading(false); // Stop loading once check is done
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array ensures this runs once on app start

  // If still loading, show a loading screen
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="content-container flex">
          <Routes>
            {/* Redirect to Dashboard if authenticated, otherwise to Auth */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Auth setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
