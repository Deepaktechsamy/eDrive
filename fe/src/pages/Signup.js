import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaKey } from "react-icons/fa";
import { motion } from "framer-motion";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [secretCode, setSecretCode] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const correctSecretCode = "gokulraj";

        if (role === "staff" && secretCode !== correctSecretCode) {
            alert("Incorrect secret code for staff signup!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/signup", {
                email,
                password,
                role,
                secretCode,
            });
            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Signup failed! Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
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
                <img src="https://i.pinimg.com/736x/29/74/45/2974452a2433b07015b3b70b61f725f8.jpg" alt="Illustration" style={styles.image} />
                <h2 style={styles.siteText}>Join Us Today</h2>
                <p style={styles.subText}>Create an account to get started with our secure platform.</p>
            </motion.div>
            <motion.div 
                style={styles.rightPanel} 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8 }}
            >
                <div style={styles.formContainer}>
                    <h2 style={styles.header}>Create Your Account</h2>
                    <form onSubmit={handleSignup}>
                        <div style={styles.inputContainer}>
                            <FaUser style={styles.icon} />
                            <input
                                type="email"
                                placeholder="Email"
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
                        <div style={styles.inputContainer}>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                                style={styles.select}
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        {role === "staff" && (
                            <div style={styles.inputContainer}>
                                <FaKey style={styles.icon} />
                                <input
                                    type="text"
                                    placeholder="Enter Secret Code"
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                    required
                                    style={styles.input}
                                />
                            </div>
                        )}

                        <div style={styles.buttonContainer}>
                            <button type="submit" disabled={loading} style={styles.button}>
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                            <button type="button" style={styles.signupButton} onClick={() => navigate("/login")}>
                                Login
                            </button>
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
        width: "70%",
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
        maxWidth: "350px",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
    },
    header: {
        fontSize: "1.8rem",
        color: "#333",
        marginBottom: "20px",
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: "5px",
        margin: "10px 0",
        padding: "10px",
    },
    icon: {
        marginRight: "10px",
        color: "#666",
    },
    input: {
        width: "100%",
        border: "none",
        background: "transparent",
        fontSize: "1rem",
        outline: "none",
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

export default Signup;
