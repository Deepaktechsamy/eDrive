import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        periods: { 1: "Absent", 2: "Absent", 3: "Absent", 4: "Absent", 5: "Absent", 6: "Absent", 7: "Absent" }
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Access denied! Please log in.");
            navigate("/login");
            return;
        }

        const fetchUserRole = async () => {
            try {
                const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode JWT
                setUserRole(tokenData.role);
            } catch (error) {
                console.error("Error decoding token:", error);
                alert("Authentication failed! Redirecting to login.");
                navigate("/login");
            }
        };

        fetchUserRole();
        fetchAttendance();
    }, [navigate]);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/attendance/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const handleStatusChange = (index, status) => {
        setFormData((prevData) => ({
            ...prevData,
            periods: { ...prevData.periods, [index + 1]: status }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            if (editingStudent) {
                await axios.put(`http://localhost:5000/api/attendance/${editingStudent._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Attendance updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/attendance/mark", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Attendance marked successfully!");
            }

            setEditingStudent(null);
            setFormData({ name: "", periods: { 1: "Absent", 2: "Absent", 3: "Absent", 4: "Absent", 5: "Absent", 6: "Absent", 7: "Absent" } });
            fetchAttendance();
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ name: student.name, periods: { ...student.periods } });
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/attendance/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Attendance record deleted!");
            fetchAttendance();
        } catch (error) {
            console.error("Error deleting attendance:", error);
        }
    };

    if (userRole !== "staff") {
        return <h3 className="text-center mt-5 text-danger">Access Denied! Only staff can view attendance.</h3>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Attendance Tracker (Staff Only)</h2>

            {/* Attendance Form */}
            <AttendanceForm 
                formData={formData} 
                setFormData={setFormData} 
                handleSubmit={handleSubmit} 
                handleStatusChange={handleStatusChange} 
                editingStudent={editingStudent} 
            />

            {/* Attendance Table (Grouped by Date) */}
            <AttendanceTable students={students} handleEdit={handleEdit} handleDelete={handleDelete} />
        </div>
    );
};

// Attendance Form Component
const AttendanceForm = ({ formData, setFormData, handleSubmit, handleStatusChange, editingStudent }) => (
    <div style={styles.card}>
        <h4>{editingStudent ? "Edit Attendance" : "Mark Attendance"}</h4>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Student Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div style={styles.statusButtons}>
                {[...Array(7)].map((_, i) => (
                    <div key={i} style={styles.statusGroup}>
                        <span>Period {i + 1}</span>
                        <div>
                            <button
                                type="button"
                                style={{ ...styles.status, ...(formData.periods[i + 1] === "Present" && styles.selectedP) }}
                                onClick={() => handleStatusChange(i, "Present")}
                            >P</button>
                            <button
                                type="button"
                                style={{ ...styles.status, ...(formData.periods[i + 1] === "Absent" && styles.selectedA) }}
                                onClick={() => handleStatusChange(i, "Absent")}
                            >A</button>
                            <button
                                type="button"
                                style={{ ...styles.status, ...(formData.periods[i + 1] === "Late" && styles.selectedL) }}
                                onClick={() => handleStatusChange(i, "Late")}
                            >L</button>
                        </div>
                    </div>
                ))}
            </div>

            <button type="submit" className="btn btn-primary mt-3">{editingStudent ? "Update" : "Submit"}</button>
        </form>
    </div>
);

// Group attendance records by date
const groupByDate = (students) => {
    return students.reduce((acc, student) => {
        const date = new Date(student.date).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(student);
        return acc;
    }, {});
};

// Attendance Table Component
const AttendanceTable = ({ students, handleEdit, handleDelete }) => {
    const groupedRecords = groupByDate(students);

    return (
        <div>
            <h4>All Attendance Records</h4>
            {Object.keys(groupedRecords).map((date) => (
                <div key={date} style={{ marginBottom: "20px" }}>
                    <h5 className="text-primary">{date}</h5>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {[...Array(7)].map((_, i) => (
                                    <th key={i}>Period {i + 1}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedRecords[date].map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    {[...Array(7)].map((_, i) => (
                                        <td key={i}>{student.periods?.[i + 1]}</td>
                                    ))}
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(student)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};




const styles = {
    container: { 
        padding: "20px", 
        fontFamily: "Arial, sans-serif", 
        maxWidth: "100vw", 
        overflowX: "auto", 
        marginLeft: "50px", 
        minHeight: "100vh",  // Prevents footer from hiding
        paddingBottom: "60px" // Extra space at the bottom to show the footer
    },
    title: { textAlign: "center", marginBottom: "20px" },
    card: { 
        background: "#FFF", 
        padding: "20px", 
        borderRadius: "30px", 
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", 
        maxWidth: "900px", 
        margin: "auto"
    },
    statusButtons: { 
        display: "flex", 
        flexDirection: "column", 
        gap: "10px",
        paddingBottom: "10px"
    },
    statusGroup: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    status: { 
        padding: "10px", 
        margin: "0 5px", 
        cursor: "pointer", 
        borderRadius: "50%", 
        border: "none",
        width: "40px",
        height: "40px",
        textAlign: "center"
    },
    selectedP: { background: "#10B981", color: "white" },
    selectedA: { background: "#EF4444", color: "white" },
    selectedL: { background: "#FACC15", color: "black" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    buttonContainer: { textAlign: "center", marginTop: "20px" },
    footer: { 
        position: "fixed", // Keeps footer in place
        bottom: "0",
        width: "100%",
        backgroundColor: "#f1f1f1",
        textAlign: "center",
        padding: "10px",
        boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)"
    }
};


export default Attendance;
