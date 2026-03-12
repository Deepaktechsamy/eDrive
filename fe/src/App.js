import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import Iotdash from "./pages/Iotdash";
import SsdDash from "./pages/SsdDash";
import PsaDash from "./pages/PsaDash";
import RenEnergy from "./pages/RenEnergy";
import SemDash from "./pages/SemDash";
import Attendance from "./pages/Attendence"
import Blogs from "./components/Blogs"; // Import Blogs page
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/SideBar";
import ChatBot from "./pages/ChatBot";

const Layout = ({ children }) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, [location]);

    return (
        <>
            {isAuthenticated && <Header />}
            <div className="app-container">
                {isAuthenticated && <Sidebar />}
                <div className="content">{children}</div>
            </div>
            {isAuthenticated && <Footer />}

            <style>{`
                .app-container {
                    display: flex;
                    min-height: 100vh;
                }
                
                .content {
                    flex-grow: 1;
                    padding: 20px;
                }
            `}</style>
        </>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes with Layout */}
                <Route path="/main" element={<Layout><Main /></Layout>} />
                <Route path="/attendence" element={<Layout><Attendance /></Layout>} />
                <Route path="/chatbot" element={<Layout><ChatBot /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/iotdash" element={<Layout><Iotdash /></Layout>} />
                <Route path="/ssddash" element={<Layout><SsdDash /></Layout>} />
                <Route path="/psadash" element={<Layout><PsaDash /></Layout>} />
                <Route path="/renenergy" element={<Layout><RenEnergy /></Layout>} />
                <Route path="/semdash" element={<Layout><SemDash /></Layout>} />
                <Route path="/blogs" element={<Layout><Blogs /></Layout>} /> {/* Added Blogs route */}
            </Routes>
        </Router>
    );
}

export default App;
