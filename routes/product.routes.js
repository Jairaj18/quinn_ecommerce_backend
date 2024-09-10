import express from "express";
import {createProduct, deleteProduct, getProductById, getAllProducts, updateProduct,addToWishList, rating} from '../controllers/product.controller.js';
const router = express.Router();
import {isAdmin, authMiddleware} from '../middlewares/authMiddleware.js' 

router.post('/createProduct',authMiddleware,isAdmin, createProduct);
router.get('/getProductById/:id', getProductById);
router.put('/updateProduct/:id',authMiddleware,isAdmin, updateProduct);
router.get('/getAllProduct',getAllProducts);
router.delete('/deleteProduct/:id',authMiddleware,isAdmin , deleteProduct);
router.put('/addToWishList',authMiddleware , addToWishList);
router.put('/rating',authMiddleware,rating);

export default router;