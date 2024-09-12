import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { createBlog, getABlog, dislikeBlog, updateBlog ,getAllBlog,deleteBlog, likeBlog} from "../controllers/blog.controller.js";
const router  = express.Router();
import { blogImgResize, productImgResize, uploadPhoto } from "../middlewares/uploadImages.js";
import { uploadImages } from "../controllers/blog.controller.js";
router.post('/createBlog', authMiddleware, isAdmin , createBlog);
router.put('/updateBlog/:id', authMiddleware, isAdmin , updateBlog);
router.get('/getById/:id', getABlog );
router.get('/getAllBlog', getAllBlog);
router.delete('/delete/:id',authMiddleware, isAdmin, deleteBlog);
router.put('/likeBlog', authMiddleware, likeBlog);
router.put('/dislikeBlog', authMiddleware,dislikeBlog);
router.put('/upload/:id',  authMiddleware, isAdmin, uploadPhoto.array('images', 10), blogImgResize,  uploadImages );

export default router;

