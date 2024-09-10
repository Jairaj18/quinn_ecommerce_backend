import express from "express";
const router = express.Router();
import { createCategory, deleteCategory, updateCategory,getCategoryById,getAllCategory } from "../controllers/product.categorery.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

router.post('/createCategory',authMiddleware,isAdmin, createCategory);
router.put('/updateCategory/:id',authMiddleware,isAdmin, updateCategory);
router.delete('/deleteCategory/:id',authMiddleware,isAdmin, deleteCategory);
router.get('/getCategoryById/:id', getCategoryById);
router.get('/getCategory', getAllCategory);

export default router;