import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Dashboard = () => {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token"); // Get token from localStorage

        if (!token) {
            alert("Unauthorized! Please login.");
            navigate("/login");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/dashboard", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Send token
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessage(data.message);
                    setUsername(data.username);
                } else {
                    alert("Unauthorized! Please login again.");
                    localStorage.removeItem("jwt_token"); //  Remove invalid token
                    navigate("/login"); // Redirect
                }
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                setMessage("Error loading dashboard");
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            {/* Logout Button & Welcome Message */}
            <div className="dashboard-header">
                {message === "Login successful" ? (
                    <>
                        <h2>Welcome, {username}!</h2>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <h2 className="error-message">{message}</h2>
                )}
            </div>

            {/* About Section */}
            <div className="card">
                <div className="about-section">
                    <h2>About</h2>
                    <p>
                        Welcome to Syncthreads Computing! Founded in 2019 by IIT Bombay alumni, we are a Pune-based company specializing in artificial intelligence, radio frequency engineering, embedded systems, photonics, and UI/UX design. Our mission is to deliver inspiring technology that transforms lives, with a particular focus on defense, healthcare, and agriculture sectors. We pride ourselves on our commitment to quality, continuous improvement, and fostering collaborative partnerships with both industry and academia. Join us as we innovate and create impactful solutions for a better tomorrow.
                    </p>
                </div>
                <div className="image-section">
                    <img src="https://www.syncthreads.in/assets/images/banner3.png" alt="Dashboard" />
                </div>
            </div>

            {/* New Card for Map Navigation */}
            {message === "Login successful" && (
                <div className="card-2 map-card">
                    <h3>You can view your current location with ease using our interactive map feature. Simply click the button below to access the map and navigate seamlessly to your precise geographical coordinates.</h3>
                    <button onClick={() => navigate('/map')}>Go to Map</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
