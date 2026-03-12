import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
                email,
                password,
            });
            if (response.data.token) {
                alert("Login successful!");
                localStorage.setItem("token", response.data.token);
                navigate("/main");
            } else {
                alert("Login failed! No token received.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed! Please try again.";
            alert(errorMessage);
        }
    };

    return (
        <div style={styles.container}>
            <motion.div 
                style={styles.leftPanel} 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8 }}
            >
                <img src="https://i.pinimg.com/736x/93/d5/ed/93d5edfdd521ea19495daba0ac71d98c.jpg" alt="Illustration" style={styles.image} />
                <h2 style={styles.siteText}>Welcome to Secure Login</h2>
                <p style={styles.subText}>Your security is our priority. Access your account safely.</p>
            </motion.div>
            <motion.div 
                style={styles.rightPanel} 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8 }}
            >
                <div style={styles.formContainer}>
                    <h1 style={styles.pageTitle}>User Authentication Portal</h1>
                    <p style={styles.pageDescription}>Sign in to your account to access exclusive features and manage your settings.</p>
                    <h2 style={styles.header}>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div style={styles.inputContainer}>
                            <FaUser style={styles.icon} />
                            <input
                                type="email"
                                placeholder="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputContainer}>
                            <FaLock style={styles.icon} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.button}>Login</button>
                            <button type="button" style={styles.signupButton} onClick={() => navigate("/signup")}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    leftPanel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "20px",
    },
    image: {
        width: "60%",
        borderRadius: "10px",
    },
    siteText: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#333",
        marginTop: "20px",
    },
    subText: {
        fontSize: "1rem",
        color: "#666",
        textAlign: "center",
    },
    rightPanel: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#34495E",
        padding: "40px",
    },
    formContainer: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        backdropFilter: "blur(10px)",
    },
    pageTitle: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: "#fff",
    },
    pageDescription: {
        fontSize: "1rem",
        color: "#ccc",
        marginBottom: "15px",
    },
    header: {
        fontSize: "1.5rem",
        color: "#fff",
        marginBottom: "20px",
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "5px",
        margin: "10px 0",
        padding: "12px",
    },
    icon: {
        marginRight: "10px",
        color: "#fff",
    },
    input: {
        width: "100%",
        border: "none",
        background: "transparent",
        fontSize: "1rem",
        outline: "none",
        color: "#fff",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
    },
    button: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#2ECC71",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "1.2rem",
        cursor: "pointer",
        marginRight: "10px",
    },
    signupButton: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#1E8449",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "1.2rem",
        cursor: "pointer",
    },
};

export default Login;
