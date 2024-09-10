import brand from "../model/product.brand.model.js";
import asyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validate.mongodbId.js";

export const createBrand = asyncHandler(async(req,res)=>{
    try{
        const newBrand = await brand.create(req.body);
        res.json(newBrand);

    }catch(err){
        throw new Error(err);
    }
})

export const updateBrand = asyncHandler(async(req,res)=>{
    const id = req.params;
    validateMongodbId(id);
    try{
        const updatedBrand = await brand.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )
        res.json(updatedBrand);

    }catch(err){
        throw new Error(err);
    }
})


export const deleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedBrand = await brand.findByIdAndDelete(id);
        res.json({
            message: "brand dedleted successfully",
            deletedBrand
        });
    }catch(err){
        throw new Error(err);
        
    }
})

export const getBrandById = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getABrand  = await brand.findById(id);
        res.json(getABrand);
    }catch(err){
        throw new Error(err);
    }
})

export const getAllBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    
    try {
      const getAllBrand = await brand.find();
      res.json({
        message: "all brands are listed here",
        getAllBrand});
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  }
);
  