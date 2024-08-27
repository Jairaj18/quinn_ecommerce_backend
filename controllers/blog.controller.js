import blog from "../model/blog.model.js";
import user from "../model/user.model.js";
import asyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validate.mongodbId.js";

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
    const getBlog = await blog.findById(id);
    const updateView = await blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json({
        updateView
    })
  } catch (err) {}
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

