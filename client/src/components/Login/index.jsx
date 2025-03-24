import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt_token", data.token); // Save token in localStorage
        alert("Login Successful");
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        setErrorMsg(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMsg("Something went wrong. Please check your connection.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <img
          src="https://www.syncthreads.in/assets/images/about_banner.png"
          className="login-image"
          alt="website login"
        />
        <div className="login-form">
          <img
            src="https://media.licdn.com/dms/image/v2/C510BAQHC4BeBy10nUw/company-logo_200_200/company-logo_200_200/0/1630614193199/syncthreads_computing_logo?e=1747872000&v=beta&t=uBYCvu2VmnZMJce1q3ByiqaBlZgbDIAwpRX2kXFvFEo"
            className="login-website-logo"
            alt="website logo"
          />
          <form className="form-container" onSubmit={handleLogin}>
            <div className="input-container">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {errorMsg && <p className="error-message">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
