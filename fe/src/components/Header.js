import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <motion.nav
            className="navbar navbar-dark bg-dark px-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Logo (Hidden on Mobile) */}
                <div className="d-none d-md-block" style={{ width: "100px" }}></div>

                {/* Center - EEE E-Drive */}
                <motion.div
                    className="navbar-brand text-light fw-bold mx-auto text-center"
                    whileHover={{ scale: 1.1 }}
                    style={{ flexGrow: 1 }}
                >
                    EEE E-Drive
                </motion.div>

                {/* Logout Button */}
                <motion.button
                    className="btn btn-danger ms-auto logout-btn"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Logout
                </motion.button>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .container-fluid {
                        flex-direction: row;
                        justify-content: space-between;
                        padding: 10px;
                    }

                    .navbar-brand {
                        font-size: 16px;
                    }

                    .logout-btn {
                        font-size: 14px;
                        padding: 5px 10px;
                    }
                }

                @media (max-width: 480px) {
                    .navbar-brand {
                        font-size: 14px;
                    }

                    .logout-btn {
                        font-size: 12px;
                        padding: 4px 8px;
                    }
                }
            `}</style>
        </motion.nav>
    );
};

export default Header;
