import slugify from 'slugify';
import Product from '../model/product.model.js';
import asyncHandler from 'express-async-handler'

export const createProduct = asyncHandler(async(req, res) => {
    const {title,description,price,category,brand,quantity,images,color } = req.body;
    
    try{
       
        const product = new Product({
            title,
            slug: slugify(req.body.title),
            description,
            price,
            category,
            brand,
            quantity,
            images,
            color,
          });
          if(req.body.title){
            req.body.slug = slugify(req.body.title);
          }
          const createdProduct = await product.save();
          res.status(201).json(createdProduct);
    }catch(err){
        throw new Error(err);
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: id });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            detail: deletedProduct
        });
    } catch (err) {
        throw new Error(err);  
    }
});

export const getProductById = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.status(201).json(findProduct);
    } catch(err){
        throw new Error(err);
    }
})

export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const queryObj  =  {...req.query};
        const excludeFields = ['page' ,'sort','limit','fields'];
        queryObj2 = excludeFields.forEach(el=> delete queryObj[el]);
        query
        console.log(queryObj, queryObj2);

        // Fetch products based on the category     } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});



