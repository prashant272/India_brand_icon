import express from "express";
import {
    createBlog,
    getAdminBlogs,
    getPublishedBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
} from "../controllers/blogController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import { uploadAndCompress } from "../middleware/imageUploadMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getPublishedBlogs);
router.get("/:slug", getBlogBySlug);

// Admin Routes
router.get("/admin/all", authenticate, requireAdmin, getAdminBlogs);
router.post(
    "/",
    authenticate,
    requireAdmin,
    uploadAndCompress("coverImage", 1),
    createBlog
);
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    uploadAndCompress("coverImage", 1),
    updateBlog
);
router.delete("/:id", authenticate, requireAdmin, deleteBlog);

export default router;