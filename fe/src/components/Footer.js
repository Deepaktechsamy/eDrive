import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
    return (
        <footer className="footer bg-dark text-light text-center py-3">
            <p className="mb-0">© 2024 Your Website. All rights reserved.</p>

            <style>{`
                .footer {
                    width: 100%;
                    position: relative;
                    bottom: 0;
                }

                @media (min-width: 768px) {
                    .footer {
                        position: fixed;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
