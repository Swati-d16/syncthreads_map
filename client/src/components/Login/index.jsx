import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate(); // useNavigate Hook

  const onSubmitSuccess = (token) => {
    Cookies.set("jwt_token", token, { expires: 30, path: "/" });
    navigate("/dashboard"); // Redirect after login success
  };

  const onSubmitFailure = (message) => {
    setShowSubmitError(true);
    setErrorMsg(message);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.token) {
        onSubmitSuccess(response.data.token);
      } else {
        onSubmitFailure("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? "Unable to connect to server. Please check if the server is running."
          : error.response
          ? error.response.data?.error || `Error: ${error.response.status}`
          : "Login failed. Please try again.";
      onSubmitFailure(errorMessage);
    }
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
          <form className="form-container" onSubmit={submitForm}>
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
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
