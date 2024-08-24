import slugify from 'slugify';
import Product from '../model/product.model.js';
import asyncHandler from 'express-async-handler'
import { get } from 'mongoose';
import { query } from 'express';

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
        // Clone the query object to avoid mutating the original req.query
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        // Remove fields that should not be included in the query
        excludeFields.forEach((el) => delete queryObj[el]);

        console.log(queryObj, req.query);

        // Create a query string
        let queryStr = JSON.stringify(queryObj);
        // Add $ to operators for MongoDB
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // Create a query object
        let query = Product.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } 

        // pagination 
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1 ) * limit;
        query = query.skip(skip).limit(limit);
        
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new error ("This page does not exist");
        }
        console.log(page, limit, skip);

        // Execute the query
        const products = await query;

        res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


