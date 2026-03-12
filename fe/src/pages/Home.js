import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.videoBg}>
        <source src="/mathe.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <motion.h1 
          style={styles.heading}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <u>EEE E-Drive</u>
        </motion.h1>
        <motion.p 
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          The ultimate digital hub for EEE students.
        </motion.p>
        <motion.p 
          style={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Store, organize, and access your notes seamlessly. Enhance your learning experience
          with our well-structured e-drive designed for efficiency and ease.
        </motion.p>
        <div style={styles.buttons}>
          <motion.a 
            href="/login" 
            style={styles.btn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Login
          </motion.a>
          <motion.a 
            href="/signup" 
            style={styles.btnSecondary}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Sign Up
          </motion.a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  videoBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  content: {
    position: "relative",
    zIndex: 2,
    color: "#155724",
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
    maxWidth: "700px",
  },
  heading: {
    fontSize: "52px",
    fontWeight: "bold",
    color: "#28a745",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#218838",
    marginBottom: "10px",
  },
  description: {
    fontSize: "20px",
    color: "#000000",
    maxWidth: "600px",
    margin: "0 auto 15px",
    lineHeight: "1.6",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  btn: {
    padding: "14px 28px",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "0.3s ease",
  },
  btnSecondary: {
    padding: "14px 28px",
    backgroundColor: "transparent",
    color: "#28a745",
    borderRadius: "8px",
    border: "2px solid #28a745",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "0.3s ease",
  },
};

export default Home;
