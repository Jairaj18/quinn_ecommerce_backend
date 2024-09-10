import category from "../model/product.category.model.js";
import asyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validate.mongodbId.js";

export const createCategory = asyncHandler(async(req,res)=>{
    try{
        const newCategory = await category.create(req.body);
        res.json(newCategory);

    }catch(err){
        throw new Error(err);
    }
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id); 
    try {
        const updatedCategory = await category.findByIdAndUpdate(
            id, 
            req.body,
            { new: true } 
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedCategory = await category.findByIdAndDelete(id);
        res.json(deletedCategory);
    }catch(err){
        res.status(500).json({ message: err.message }); 
    }
})

export const getCategoryById = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getaCategory  = await category.findById(id);
        res.json(getaCategory);
    }catch(err){
        res.status(500).json({ message: err.message }); 
    }
})

export const getAllCategory = asyncHandler(async (req, res) => {
    try {
      const getAllCategory = await category.find();
      res.json(getAllCategory);
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  }
);
  