import express from "express";
const router = express.Router();
import { createCategory, deleteCategory, updateCategory,getCategoryById,getAllCategory } from "../controllers/product.categorery.controller";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

router.post('/createCategory',authMiddleware,isAdmin, createCategory);
router.put('/updateCategory',authMiddleware,isAdmin, updateCategory);
router.delete('/deleteCategory',authMiddleware,isAdmin, deleteCategory);
router.get('/getCategory/:id', getCategoryById);
router.get('/getCategory', getAllCategory);

export default router;