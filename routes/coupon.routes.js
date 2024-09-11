import express from "express";
import { createCoupon, deleteCoupon, getAllCoupon, updateCoupons } from "../controllers/coupon.controller.js";
const router = express.Router();
import { authMiddleware,isAdmin } from "../middlewares/authMiddleware.js";

router.post('/createCoupon', authMiddleware, isAdmin, createCoupon);
router.get('/getAllCoupon', authMiddleware, getAllCoupon);
router.put('/updateCoupon/:id', authMiddleware, isAdmin,updateCoupons);
router.delete('/deleteCoupon/:id', authMiddleware, isAdmin,deleteCoupon);

export default router;