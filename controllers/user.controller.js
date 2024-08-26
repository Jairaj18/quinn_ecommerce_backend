import generateToken from "../config/jwtToken.js";
import user from "../model/user.model.js";
import userSchema from "../model/user.model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from '../utils/validate.mongodbId.js';
import generateRefreshToken from "../config/refershToken.js";
import jwt from 'jsonwebtoken';
import {sendEmail} from "../controllers/email.controller.js"

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

 export const forgetPasswordToken = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const userEnter = await user.findOne({email});
    console.log(userEnter)
    if(!userEnter){
        throw new Error("User not found with this mail id");
    };
    try{ 
        const token = await userEnter.createPasswordResetToken();
        await userEnter.save();
        
const resetPasswordUrl = `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #2c3e50;">
    <h2 style="color: #3498db;">Hey ${userEnter.firstname || 'there'},</h2>
    <p>Forgot your password? No problem! Let's get you back into Quinn, shall we?</p>
    <p>Click the link below to reset your password:</p>
    <p style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:5000/api/user/reset-password/${token}" 
           style="background-color: #3498db; color: #ffffff; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
           Reset Your Password
        </a>
    </p>
    <p>Heads up: this link is only valid for the next 10 minutes. Act fast!</p>
    <p>If you didn't request this, you can safely ignore this email—no action needed.</p>
    <p>Cheers,<br/>The Quinn Team</p>
    <footer style="margin-top: 40px; color: #95a5a6; font-size: 14px;">
        <p>Need assistance? <a href="http://localhost:5000/support" style="color: #3498db;">We're here to help</a></p>
        <p>Quinn © 2024 - All rights reserved</p>
    </footer>
</div>
`;
    const data = {
            to: email,
            text: "hey user",
            subject: "Forget Password Link",
            html: resetPasswordUrl,
        }
        sendEmail(data);
        res.status(201).json({
            msg: "Massage send successfully"
        })
    }catch(err){
        throw new Error(err);

    }
  })
  
  export const resetPassword = asyncHandler(async(req,res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const userEnter = await user.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt:Date.now()}
    })
    if(!user) throw new Error("Token Expired, PLease try again later");
    userEnter.password = password;


})

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

export const updatePassword = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { password } = req.body; // Destructuring to get the password from req.body
    validateMongodbId(_id);
    const users = await user.findById(_id); // Retrieve the user document

    if (password) {
        users.password = password; // Update the password field
        const updatedPassword = await users.save(); // Save the updated document
        res.json(updatedPassword); // Send the updated user document as a response
    } else {
        res.json(users); // If no password is provided, return the user document as is
    }
});
