import { request } from 'express';
import mongoose from 'mongoose';
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true,
        uppercase:true
    },
    expire:{
        type: Date,
        required: true,

    },
    discount:{
        type:Number,
        required: true
    }
})

const couponModule = mongoose.model('Coupon',couponSchema);
export default couponModule;