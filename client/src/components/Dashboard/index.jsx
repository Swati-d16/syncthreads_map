import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import "./index.css";

const Dashboard = () => {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("jwt_token"); // ✅ Get token from Cookies

        if (!token) {
            navigate("/login");
            return;
        }

        axios.get("http://localhost:5000/api/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setMessage(res.data.message);
            setUsername(res.data.username );
        })
        .catch(error => {
            console.error("API Error:", error);

            if (error.response && error.response.status === 401) {
                Cookies.remove("jwt_token"); // ✅ Remove invalid token
                navigate("/login");
            } else {
                setMessage("Error loading dashboard");
            }
        });
    }, [navigate]);



    return (
        <div className="dashboard-container">
            {/* Card Section */}
            <div className="card">
                <div className="about-section">
                    
                 
                    <h2>About</h2>
                    <p>Welcome to Syncthreads Computing! Founded in 2019 by IIT Bombay alumni, we are a Pune-based company specializing in artificial intelligence, radio frequency engineering, embedded systems, photonics, and UI/UX design. Our mission is to deliver inspiring technology that transforms lives, with a particular focus on defense, healthcare, and agriculture sectors. We pride ourselves on our commitment to quality, continuous improvement, and fostering collaborative partnerships with both industry and academia. Join us as we innovate and create impactful solutions for a better tomorrow.​.</p>
                    
                </div>
                <div className="image-section">
                <img src="https://www.syncthreads.in/assets/images/banner3.png" alt="Dashboard" />
                </div>
            </div>
               
         

            {/* Welcome Message & Button */}
            {message === 'Login successful' && (
                <div className="welcome-section">
                    <h2>Welcome, {username}!</h2>
                    <button onClick={() => navigate('/map')}>Go to Map</button>
                </div>
            )}
            {/*<div className='card-2'>
                <p></p>
                <button onClick={() => navigate('/map')}>Go to Map </button>
            </div>*/}

           
        </div>
    );
};

export default Dashboard;
