import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        role: "student",
        image: null
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blog/`);
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("author", formData.author);
        data.append("role", formData.role);
        data.append("image", formData.image);

        try {
            await axios.post("${process.env.REACT_APP_BACKEND_URL}/api/blog/create", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Blog posted successfully!");
            setFormData({ title: "", content: "", author: "", role: "student", image: null });
            fetchBlogs(); // Refresh blog list
        } catch (error) {
            console.error("Error posting blog:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Blogs</h2>

            {/* Blog Form */}
            <div className="card p-3 mb-4">
                <h4>Create a Blog Post</h4>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea name="content" className="form-control" rows="4" value={formData.content} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Author</label>
                        <input type="text" name="author" className="form-control" value={formData.author} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload Image</label>
                        <input type="file" name="image" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>

            {/* Blog List */}
            <h4>All Blog Posts</h4>
            <div className="row">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog._id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={`${process.env.REACT_APP_BACKEND_URL}/bloguploads/${blog.image}`} className="card-img-top" alt="Blog" />
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <p className="card-text">{blog.content.substring(0, 100)}...</p>
                                    <p className="text-muted">By {blog.author} ({blog.role})</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No blogs found.</p>
                )}
            </div>
        </div>
    );
};

export default Blogs;
