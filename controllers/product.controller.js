import slugify from "slugify";
import Product from "../model/product.model.js";
import asyncHandler from "express-async-handler";
import { get } from "mongoose";
import { query } from "express";
import User from "../model/user.model.js";
import validateMongodbId from "../utils/validate.mongodbId.js";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    brand,
    quantity,
    images,
    color,
  } = req.body;

  try {
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
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
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
        message: "Product not found",
      });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

export const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, 'images');
    const urls = [];
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    for (const file of files) {
      const { path } = file;
      try {
        const uploadedUrl = await uploader(path);
        urls.push(uploadedUrl);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return res.status(500).json({ message: 'Error uploading file.' });
      } finally {
        fs.unlinkSync(path); // Ensure file is deleted regardless of upload success
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { images: urls },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(updatedProduct);
  } catch (error) {
    console.error('Error in uploadImages:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});


  export const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = cloudinaryDeleteImg(id, "images");
      res.json({ message: "Deleted" });
    } catch (error) {
      throw new Error(error);
    }
  });
  

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted successfully",
      detail: deletedProduct,
    });
  } catch (err) {
    throw new Error(err);
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.status(201).json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});

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
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new error("This page does not exist");
    }
    console.log(page, limit, skip);
    const products = await query;

    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  const user = await User.findById(_id);

  const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

  if (alreadyAdded) {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: prodId } },
      { new: true }
    );
    return res.json({
      message: "product is removed from the wishlist",
      updatedUser,
    });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: prodId } },
      { new: true }
    );
    return res.json({
      message: "product is added to wishlist",
      updatedUser,
    });
  }
});

export const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user; 
    const { star, prodId ,comment} = req.body; 

    try {
        const product = await Product.findById(prodId); 

        let alreadyRated = product.rating.find(
            (userRating) => userRating.postedby.toString() === _id.toString()
        ); 

        if (alreadyRated) {
            // If the user has already rated, update the existing rating
            const updateRating = await Product.updateOne(
                {
                    rating: { $elemMatch: alreadyRated },
                },
                {
                    $set: { 
                        'rating.$.star': star ,
                        'rating.$.comment': comment
                    },
                }
            );

            
        } else {
            // If the user has not rated, add a new rating
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        rating: {
                            star: star,
                            comment:comment,
                            postedby: _id
                        }
                    }
                },
                {
                    new: true
                }
            );
        }

        // Calculate and update the average rating
        const getAllRating = await Product.findById(prodId);
        let totalRatings = getAllRating.rating.length;
        let ratingSum = getAllRating.rating
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRatings);

        let finalProduct = await Product.findByIdAndUpdate(
            prodId,
            { totolratings: actualRating },
            { new: true }
        );

        return res.json(finalProduct); 

    } catch (err) {
        res.json({ message: err.message }); 
    }
});

