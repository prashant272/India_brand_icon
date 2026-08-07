import express from "express";
import { getGallery, updateUrls, uploadPhotos, deletePhoto } from "../controllers/galleryController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import { uploadAndCompress } from "../middleware/imageUploadMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getGallery);

// Admin routes
router.use(authenticate, requireAdmin);

router.put("/urls", updateUrls);
// Use the uploadAndCompress middleware for 'photos' field
router.post("/photos", uploadAndCompress("photos", 20), uploadPhotos);
router.delete("/photos", deletePhoto);

export default router;
