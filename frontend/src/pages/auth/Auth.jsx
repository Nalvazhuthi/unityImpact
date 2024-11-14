import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    fullName: "", // Only used for signup
    email: "",
    password: "",
    type: "", // Only used for signup
    location: "", // Only used for signup
  });

  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const [successMessage, setSuccessMessage] = useState(""); // For success messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success messages on each form submission
    setErrorMessage("");
    setSuccessMessage("");

    const { fullName, email, password, type, location } = formData;

    // Validate the form data (client-side)
    if (isLogin) {
      // For login, we need only email and password
      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        return;
      }
    } else {
      // For signup, all fields are required
      if (!fullName || !email || !password || !type || !location) {
        setErrorMessage("All fields are required.");
        return;
      }
    }

    // Determine the API URL based on login or signup
    let url = isLogin
      ? "http://localhost:4100/auth/login" // Login endpoint
      : "http://localhost:4100/auth/signup"; // Signup endpoint

    // Prepare the payload based on whether it's login or signup
    const payload = isLogin
      ? { email, password }
      : { fullName, email, password, type, location };

    // Making a POST request to either login or signup API
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message if login/signup is successful
        setSuccessMessage(data.message || "Operation successful!");
        if (isLogin) {
          // On successful login, maybe redirect to another page or set user data
          // For now, we'll assume you want to handle user login state here.
          console.log("Logged in successfully");
          navigate("/home");
        } else {
          setIsLogin(true); // Switch to login after successful signup
        }
      } else {
        // Show error message if login/signup fails
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
              placeholder="Full Name"
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
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {/* Account Type - Radio buttons */}
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

          {/* Error or Success Messages */}
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
              className="input-field"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input-field"
            />
            <button type="submit" className="btn">
              Sign in
            </button>
          </form>

          {/* Error message */}
          <div className="error">Error message here</div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
