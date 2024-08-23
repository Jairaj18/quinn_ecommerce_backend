import generateToken from "../config/jwtToken.js";
import user from "../model/user.model.js";
import userSchema from "../model/user.model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from '../utils/validate.mongodbId.js';
import generateRefreshToken from "../config/refershToken.js";
import jwt from 'jsonwebtoken';
// import generateToken from "../config/jwtToken.js";

export const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await userSchema.findOne({ email });

    if (!findUser) {
        const newUser = await userSchema.create(req.body);
        res.status(201).json({ // Set status code to 201 for created
            msg: "User registered successfully",
            data: newUser,
        });
    } else {
        res.status(400).json({ // Set status code to 400 for bad request
            msg: "User already exists",
            success: false,
        });
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findUser = await user.findOne({ email });

    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await user.findByIdAndUpdate(
            findUser?._id,
            {
                refreshToken: refreshToken,
            }, 
            {
                new: true
            });
            res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                maxAge: 72*60*60*1000,
            })
        res.json({
            id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
        console.log(updateUser);
    } else {
        res.status(401).json({ msg: "Invalid Credentials" });
    }
});


export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const userToken = await user.findOne({ refreshToken });
    if (!userToken) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });
  

  export const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        throw new Error("No refresh token in cookies");
    }

    const refreshToken = cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const userId = decoded.id;

    const logedinU = await user.findOne({ _id: userId, refreshToken });

    if (!logedinU) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.status(204).send();
    }

    await user.findOneAndUpdate(
        { _id: userId }, 
        { refreshToken: "" });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.status(200).json(
        { message: "Logged out successfully" }
    );
});

// get all users
export const getAllUser = asyncHandler(async(req,res)=>{
    try{
        const getUsers = await user.find();
        res.json(getUsers);
    }catch(err){
        throw new Error(error);
    }
})

// get a single users 
export const getaUser = asyncHandler(async(req,res)=>{
    const userid = req.params.id;
    validateMongodbId(id);
    try{
        const uniqueuser = await user.findById(userid);
        res.json({
            uniqueuser
        })
    }catch(err){
        throw new Error(err);
    }
})

export const deleteUser = asyncHandler(async(req,res)=>{
    console.log(req.params);
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteUser = await user.findByIdAndDelete(id);
        res.json({
            deleteUser,
        })
    }catch(err){
        throw new Error(err);
    }
})

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // Correct the typo 'rerq' to 'req'
    validateMongodbId(id)
    try {
        const updatedUser = await user.findByIdAndUpdate(
            id,
            {
                firstname: req.body?.firstname,
                lastname: req.body?.lastname,
                email: req.body?.email,
                mobile: req.body?.mobile,
            },
            {
                new: true, // This option returns the updated document
                runValidators: true, // This ensures the update respects schema validation rules
            }
        );

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // Correct way to extract id
    validateMongodbId(id);
    try {
        const block = await user.findByIdAndUpdate(
            id,
            { idBlocked: true },
            { new: true }
        );

        if (block) {
            res.json({
                message: "User Blocked",
                data: block,
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }

    } catch (err) {
        res.status(500);
        throw new Error(err.message || "Error blocking user");
    }
});

export const unblockUser = asyncHandler(async(req,res)=>{
    const id = req.params;
    validateMongodbId(id);
    try{
        const unblock = user.findByIdAndUpdate(
        id,
        {
            idBlocked: false,
        },
        {
            new: true
        }
        );
        res.json({
            message: "User Unblocked"
        })
    }catch(err){
        throw new Error(err);
    }
})