import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import { FaDownload, FaTrashAlt } from "react-icons/fa";
import   "./Dashboard.css"

const Dashboard = () => {
    const [message, setMessage] = useState("");
    const [role, setRole] = useState("");
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.role);
                setMessage(decodedToken.role === "staff" ? "Welcome, Mr.R.Hariharan!" : "Hello, Student!");
            } catch (error) {
                console.error("Error decoding token", error);
                navigate("/login");
            }
        }
    }, [navigate]);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleFileUpload = async () => {
        if (!file) return alert("Please select a file to upload.");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("File uploaded successfully!");
            setFile(null);
            fetchFiles();
        } catch (error) {
            console.error("Error uploading file", error);
            alert("Failed to upload file.");
        }
    };

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/files`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files", error);
        }
    };

    const handleDeleteFile = async (fileName) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-file/${encodeURIComponent(fileName)}`, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            alert("File deleted successfully!");
            fetchFiles();
        } catch (error) {
            console.error("Error deleting file", error);
            alert("Failed to delete file.");
        }
    };

    const handleDownloadFile = (fileName) => {
        const link = document.createElement("a");
        link.href = `${process.env.REACT_APP_BACKEND_URL}/uploads/${fileName}`;
        link.download = fileName;
        link.click();
    };

    useEffect(() => {
        fetchFiles();
    }, [role]);

    return (
        <div className="dashboard-container">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              AIML  Dashboard
            </motion.h2>
            <motion.p className="greeting-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                {message}
            </motion.p>

            {role === "staff" && (
                <div className="upload-form">
                    <h3>Upload AIML Files</h3>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <motion.button className="upload-btn" onClick={handleFileUpload} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        Upload
                    </motion.button>
                </div>
            )}

            <h3>Available Files</h3>
            <table className="file-table">
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {files.length === 0 ? (
                        <tr><td colSpan="2">No files available</td></tr>
                    ) : (
                        files.map((file, index) => (
                            <tr key={index}>
                                <td>{file}</td>
                                <td>
                                    <motion.button className="download-btn" onClick={() => handleDownloadFile(file)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <FaDownload />
                                    </motion.button>
                                    {role === "staff" && (
                                        <motion.button className="delete-btn" onClick={() => handleDeleteFile(file)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <FaTrashAlt />
                                        </motion.button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
