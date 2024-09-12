import blog from "../model/blog.model.js";
import user from "../model/user.model.js";
import asyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validate.mongodbId.js";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";

export const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await blog.create(req.body);
    res.json({
      status: "success",
      newBlog,
    });
  } catch (err) {
    throw new Error(err);
  }
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBlog = await blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updateBlog,
    }); 
  } catch (err) {
    throw new Error(err);
  }
});

export const getABlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    // Find the blog by ID and populate likes and dislikes
    const getBlog = await blog.findById(id)
    .populate("likes", "firstname") // Populate likes with user's firstname
    .populate("dislikes", "firstname"); // Populate dislikes with user's firstname


    if (!getBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment the number of views
    const updatedBlog = await blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    )
    .populate("likes", "firstname") // Populate likes with user's firstname
    .populate("dislikes", "firstname"); // Populate dislikes with user's firstname


    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export const getAllBlog = asyncHandler(async(req,res)=>{
    try{
        const getBlog = await blog.find();
        res.json(getBlog);
    }catch(err){
        throw new Error(err);
    }
})

export const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteBlog = await blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    }catch(err){
        throw new Error(err);
    }
})


export const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  // Find the blog that you want to be liked
  const blogs = await blog.findById(blogId);
  if (!blogs) {
      return res.status(404).json({ message: 'Blog not found' });
  }

  // Find the logged-in user
  const loginUserId = req?.user?._id;

  // Check if the blog is already liked by the user
  const isLiked = blogs?.likes?.includes(loginUserId);

  // Check if the blog is disliked by the user
  const alreadyDisliked = blogs?.dislikes?.includes(loginUserId);

  // If the blog is disliked, remove the dislike
  if (alreadyDisliked) {
      await blog.findByIdAndUpdate(blogId, {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
      }, {
          new: true
      });
  }

  // If the blog is already liked, remove the like
  if (isLiked) {
      const updatedBlog = await blog.findByIdAndUpdate(blogId, {
          $pull: { likes: loginUserId },
          isLiked: false,
      }, {
          new: true
      });
      return res.status(200).json(updatedBlog);
  } else {
      // If the blog is not liked, add the like
      const updatedBlog = await blog.findByIdAndUpdate(blogId, {
          $push: { likes: loginUserId },
          isLiked: true,
      }, {
          new: true
      });
      return res.status(200).json(updatedBlog);
  }
});
export const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  // Find the blog that you want to be disliked
  const blogs = await blog.findById(blogId);
  if (!blogs) {
    return res.status(404).json({ message: "Blog not found" });
  }

  // Find the logged-in user
  const loginUserId = req?.user?._id;

  // Check if the blog is already disliked by the user
  const isDisliked = blogs?.dislikes?.includes(loginUserId);

  // Check if the blog is liked by the user
  const alreadyLiked = blogs?.likes?.includes(loginUserId);

  // If the blog is liked, remove the like
  if (alreadyLiked) {
    await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }

  // If the blog is already disliked, remove the dislike
  if (isDisliked) {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedBlog);
  } else {
    // If the blog is not disliked, add the dislike
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedBlog);
  }
});

export const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params; // Make sure you're extracting the `id` from params
  validateMongodbId(id); // Assuming you have a function to validate MongoDB ID

  try {
    // Cloudinary uploader function
    const uploader = async (path) => await cloudinaryUploadImg(path, "images");

    // Initialize an array to store the uploaded image URLs
    const urls = [];

    // Access the uploaded files
    const files = req.files;

    // Iterate through each file, upload, and collect URLs
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);  // Push the uploaded image URL into the array
      fs.unlinkSync(path); // Delete the local file after upload
    }

    // Update the blog with the uploaded image URLs
    const updatedBlog = await blog.findByIdAndUpdate(
      id,
      {
        images: urls,  // Use the array of image URLs
      },
      {
        new: true,  // Return the updated document
      }
    );

    // Send back the updated blog as a response
    return res.json(uploader);
  } catch (error) {
    // Return the error as a response with a proper status
    res.status(500);
    return res.json({ message: error.message });
  }
});


