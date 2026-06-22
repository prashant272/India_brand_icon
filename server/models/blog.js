import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        default: "Admin",
    },
    coverImage: {
        type: String,
        default: "",
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;