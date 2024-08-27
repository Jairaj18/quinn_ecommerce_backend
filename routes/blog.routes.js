import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { createBlog, getABlog, updateBlog ,getAllBlog,deleteBlog, likeBlog} from "../controllers/blog.controller.js";
const router  = express.Router();

router.post('/createBlog', authMiddleware, isAdmin , createBlog);
router.put('/updateBlog/:id', authMiddleware, isAdmin , updateBlog);
router.get('/getById/:id', getABlog );
router.get('/getAllBlog', getAllBlog);
router.delete('/delete/:id',authMiddleware, isAdmin, deleteBlog);
router.put('/likeBlog', authMiddleware, likeBlog);
export default router;

