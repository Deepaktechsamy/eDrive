import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBars, FaBook, FaBlogger, FaChartBar, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      initial={{ width: isMobile ? 60 : 80 }}
      animate={{ width: isOpen ? (isMobile ? 200 : 250) : (isMobile ? 60 : 80) }}
      transition={{ duration: 0.3 }}
    >
      <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={24} />
      </div>
      <ul>
        <li onClick={() => navigate("/main")}>
          <FaBook size={20} />
          {isOpen && <span>Courses</span>}
        </li>
        <li onClick={() => navigate("/blogs")}>
          <FaBlogger size={20} />
          {isOpen && <span>Blogs</span>}
        </li>
        <li onClick={() => navigate("/attendence")}>
          <FaChartBar size={20} />
          {isOpen && <span>Attendence</span>}
        </li>
        <li onClick={() => navigate("/chatbot")}>
          <FaUsers size={20} />
          {isOpen && <span>People</span>}
        </li>
      </ul>
      <style>{`
        .sidebar {
          background: #1e1e2f;
          color: white;
          height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.2);
          position: fixed;
          left: 0;
          top: 0;
          transition: width 0.3s ease;
          z-index: 1000;
        }

        .toggle-btn {
          cursor: pointer;
          margin-bottom: 20px;
          text-align: center;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          font-size: 18px;
          cursor: pointer;
          transition: 0.3s;
          border-radius: 8px;
        }

        li:hover {
          background: #00796b;
        }

        .closed li span {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: ${isOpen ? "200px" : "60px"};
          }
          li {
            font-size: 16px;
            padding: 10px;
          }
          .toggle-btn {
            text-align: left;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;
