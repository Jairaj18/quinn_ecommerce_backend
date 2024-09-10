import express from "express";
const router = express.Router();
import { createBrand,updateBrand,deleteBrand,getAllBrand,getBrandById } from "../controllers/brand.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

router.post('/createCategory',authMiddleware,isAdmin, createBrand);
router.put('/updateCategory',authMiddleware,isAdmin, updateBrand);
router.delete('/deleteCategory',authMiddleware,isAdmin, deleteBrand);
router.get('/getCategory/:id', getBrandById);
router.get('/getCategory', getAllBrand);

export default router;