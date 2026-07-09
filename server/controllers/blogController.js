import Blog from "../models/blog.js";

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Admin)
export const createBlog = async (req, res) => {
    try {
        const { title, slug, content, author, isPublished } = req.body;

        let coverImage = "";
        if (req.files && req.files.length > 0) {
            coverImage = req.files[0].location; // from imageUploadMiddleware
        }

        const blog = new Blog({
            title,
            slug,
            content,
            author: author || "Admin",
            coverImage,
            isPublished: isPublished === "true" || isPublished === true,
        });

        await blog.save();
        res.status(201).json({ success: true, data: blog });
    } catch (err) {
        console.error("Create Blog error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Slug already exists. Please choose a unique slug." });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all blogs (Admin view)
// @route   GET /api/blogs/admin
// @access  Private (Admin)
export const getAdminBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all published blogs (Public view)
// @route   GET /api/blogs
// @access  Public
export const getPublishedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single blog by slug (Public view)
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug, isPublished: true });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, author, isPublished, existingCoverImage } = req.body;

        let coverImage = existingCoverImage || "";
        if (req.files && req.files.length > 0) {
            coverImage = req.files[0].location;
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                slug,
                content,
                author,
                coverImage,
                isPublished: isPublished === "true" || isPublished === true,
            },
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, data: blog });
    } catch (err) {
        console.error("Update Blog error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Slug already exists. Please choose a unique slug." });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        await Blog.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};