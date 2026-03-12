import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChat = async () => {
        if (!prompt) return alert("Enter a message!");
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, { prompt });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Failed to get a response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fdfdfd", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <h2 style={{ color: "#222" }}>AI Assistant</h2>

            <div style={{ marginBottom: "20px" }}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="4"
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        outline: "none",
                        resize: "vertical"
                    }}
                    placeholder="Ask me anything..."
                />
            </div>

            <button
                onClick={handleChat}
                disabled={loading}
                style={{
                    padding: "10px 25px",
                    fontSize: "16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? "Thinking..." : "Get Answer"}
            </button>

            {response && (
                <div style={{ marginTop: "30px", textAlign: "left", maxWidth: "800px", margin: "30px auto" }}>
                    <h4 style={{ color: "#555", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Response:</h4>
                    <div style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        lineHeight: "1.6",
                        wordWrap: "break-word",
                        overflowWrap: "anywhere"
                    }}>
                        <ReactMarkdown
                            components={{
                                code({ inline, children, ...props }) {
                                    return inline ? (
                                        <code style={{ backgroundColor: "#f4f4f4", padding: "2px 4px", borderRadius: "3px", color: "#d63384" }} {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", overflowX: "auto", border: "1px solid #ddd", fontSize: "14px" }}>
                                            <code {...props}>{children}</code>
                                        </pre>
                                    );
                                }
                            }}
                        >
                            {response}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
