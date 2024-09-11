import Coupon from '../model/coupon.model.js';
import validateMongodbId from '../utils/validate.mongodbId.js';
import asyncHandler from 'express-async-handler';

export const createCoupon = asyncHandler(async(req,res)=>{
    try {
        const { name, expire, discount } = req.body;

        const newCoupon = new Coupon({
            name,
            expire,
            discount
        });

        const savedCoupon = await newCoupon.save();
        res.status(201).json(savedCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export const getAllCoupon = asyncHandler(async(req,res)=>{
    try{
        const newCoupon = await Coupon.find();
        return res.json(newCoupon);
    }catch(err){
        return res.json({
            message: message.err
        })

    }
})

export const updateCoupons = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // Ensure the updated document is returned and validation is run
        );
        
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json({
            message: "Coupon is successfully updated",
            updatedCoupon
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const deleteCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    }catch(err){
        return res.json({
            message: message.err
        })
    }
})