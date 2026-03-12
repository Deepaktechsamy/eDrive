import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const courses = [
    { title: "AIML", color: "#ADD8E6", image: "https://i.pinimg.com/736x/08/a3/9c/08a39cce7497809efbc7d10828461087.jpg" },
    { title: "IOT", color: "#2A9D8F", image: "https://i.pinimg.com/736x/40/93/bd/4093bd26c161d4080a3489dc28fe2cc8.jpg" },
    { title: "SSD", color: "#264653", image: "https://i.pinimg.com/736x/11/84/e4/1184e4f1496381601fb163e243adc8fc.jpg" },
    { title: "PSA", color: "#4682B4", image: "https://i.pinimg.com/736x/c2/53/6a/c2536a06dcbb2901f52c26caf0d2bd5e.jpg" },
    { title: "RES", color: "#2E7D32", image: "https://i.pinimg.com/736x/f5/68/31/f56831a47a1b6f6e8c6b4ca79f5ed6db.jpg" },
    { title: "SEM", color: "#546E7A", image: "https://i.pinimg.com/736x/55/6a/6f/556a6f697d6e9bf5fcc58a7bcd25bdbd.jpg" },
];

const CourseCard = ({ title, color, image, index }) => {
    const navigate = useNavigate();
    const handleEnrollClick = () => {
        const routes = ["/dashboard", "/iotdash", "/ssddash", "/psadash", "/renenergy", "/semdash"];
        navigate(routes[index] || "/dashboard");
    };

    return (
        <motion.div
            className="course-card"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
        >
            <motion.img
                src={image}
                alt={`Course ${index + 1}`}
                className="course-image"
                whileHover={{ scale: 1.1 }}
            />
            <h3>{title}</h3>
            <motion.button
                className="enroll-btn"
                onClick={handleEnrollClick}
                whileHover={{ scale: 1.1, backgroundColor: "#333", color: "white" }}
                whileTap={{ scale: 0.95 }}
            >
                Enroll Now
            </motion.button>
        </motion.div>
    );
};

const Main = () => (
    <div className="main-container">
        <div className="content-area">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="page-title"
            >
                Featured Courses
            </motion.h1>
            <div className="courses-grid">
                {courses.map((course, index) => (
                    <CourseCard key={index} {...course} index={index} />
                ))}
            </div>
        </div>

        {/* Styled Components */}
        <style>{`
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .main-container {
                display: flex;
                min-height: 100vh;
            }

            .content-area {
                flex: 1;
                margin-left: 260px;
                padding: 40px;
                background-color: #f9f9f9;
            }

            .page-title {
                font-size: 36px;
                font-weight: 600;
                color: #333;
                margin-bottom: 40px;
                text-align: center;
            }

            .courses-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 30px;
                justify-content: center;
            }

            .course-card {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 20px;
                color: white;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                height: 100%;
            }

            .course-card h3 {
                font-size: 20px;
                font-weight: 600;
                margin: 15px 0;
                color: white;
            }

            .course-image {
                width: 100%;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }

            .enroll-btn {
                align-self: center;
                background-color: white;
                color: black;
                border: none;
                padding: 12px 25px;
                margin-top: 15px;
                border-radius: 30px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            .enroll-btn:hover {
                background-color: #00796b;
                color: white;
            }

            .enroll-btn:focus {
                outline: none;
            }

            @media (max-width: 768px) {
                .main-container {
                    flex-direction: column;
                    margin-left: 0;
                }

                .content-area {
                    margin-left: 0;
                    padding: 20px;
                }
            }
        `}</style>
    </div>
);

export default Main;
