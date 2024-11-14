import { useState } from "react";

const Auth = () => {
    let [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        type: '',  // This will hold the selected radio button value
        location: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // You would typically send the form data to the server here
        const { fullName, email, password, type, location } = formData;

        // Example of making a POST request to the backend
        // fetch('/signup', {
        //     method: 'POST',
        //     body: JSON.stringify({ fullName, email, password, type, location }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // }).then(response => response.json())
        //   .then(data => console.log(data))
        //   .catch(error => console.error('Error:', error));

        console.log('Form submitted:', formData);
    };

    return (
        <div className="auth-wrapper">
            <div className="main">
                {/* SignUp Form */}
                <div className={`signup ${!isLogin && "active"}`}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="chk" aria-hidden="true" onClick={() => setIsLogin(false)}>
                            Sign up
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
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
                                        checked={formData.type === 'volunteer'}
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
                                        checked={formData.type === 'organization'}
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
                                        checked={formData.type === 'beneficiary'}
                                        required
                                    />
                                    <label htmlFor="beneficiary">Beneficiary</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit">
                            Sign up
                        </button>
                    </form>
                </div>

                {/* Login Form */}
                <div className={`login ${isLogin && "active"}`}>
                    <form>
                        <label htmlFor="chk" aria-hidden="true" onClick={() => setIsLogin(true)}>
                            Login
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="input-field"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="input-field"
                        />
                        <button
                            type="submit"
                            className="btn"
                        >
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
