import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    type: "",
    location: "", // Location will be formatted as "latitude, longitude"
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            location: `${latitude}, ${longitude}`,
          }));
        },
        () => {
          setErrorMessage("Unable to retrieve location.");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const { fullName, email, password, type, location } = formData;

    if (isLogin) {
      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        return;
      }
    } else {
      if (!fullName || !email || !password || !type || !location) {
        setErrorMessage("All fields are required.");
        return;
      }
    }

    let url = isLogin
      ? "http://localhost:4100/auth/login"
      : "http://localhost:4100/auth/signup";

    // Split location string into latitude and longitude
    const [latitude, longitude] = location.split(",").map(Number);

    const payload = isLogin
      ? { email, password }
      : { fullName, email, password, type, location: { latitude, longitude } };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Operation successful!");

        // Store user data in localStorage if login/signup is successful
        if (isLogin) {
          localStorage.setItem("userData", JSON.stringify(data.user)); // Save user data in localStorage
          navigate("/home");
          setIsAuthenticated(true);
        } else {
          setIsLogin(true); // Switch to login after successful signup
        }
      } else {
        setErrorMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="main">
        {/* Signup Form */}
        <div className={`signup ${!isLogin && "active"}`}>
          <label
            htmlFor="chk"
            aria-hidden="true"
            onClick={() => setIsLogin(false)}
          >
            Sign up
          </label>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="User / Organisation Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required={!isLogin} // Only required in signup
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {!isLogin && (
              <>
                <div className="location-wrapper">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                  <button type="button" onClick={getCurrentLocation}>
                    Use Current Location
                  </button>
                </div>
                <div className="account-type">
                  <label>Account Type:</label>
                  <div className="radio-wrapper">
                    <div className="flex">
                      <input
                        type="radio"
                        id="volunteer"
                        name="type"
                        value="volunteer"
                        onChange={handleInputChange}
                        checked={formData.type === "volunteer"}
                        required
                      />
                      <label htmlFor="volunteer">Volunteer</label>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        id="organization"
                        name="type"
                        value="organization"
                        onChange={handleInputChange}
                        checked={formData.type === "organization"}
                        required
                      />
                      <label htmlFor="organization">Organization</label>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        id="beneficiary"
                        name="type"
                        value="beneficiary"
                        onChange={handleInputChange}
                        checked={formData.type === "beneficiary"}
                        required
                      />
                      <label htmlFor="beneficiary">Beneficiary</label>
                    </div>
                  </div>
                </div>
              </>
            )}
            <button type="submit">{isLogin ? "Sign in" : "Sign up"}</button>
          </form>

          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
        </div>

        {/* Login Form */}
        <div className={`login ${isLogin && "active"}`}>
          <label
            className="login-header"
            htmlFor="chk"
            aria-hidden="true"
            onClick={() => setIsLogin(true)}
          >
            Login
          </label>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Sign in</button>
          </form>

          {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Auth;
