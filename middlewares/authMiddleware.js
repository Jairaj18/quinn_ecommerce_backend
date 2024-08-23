import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import user from "../model/user.model.js";

export const authMiddleware = asyncHandler(async(req,res,next)=>{
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const authenticatedUser = await user.findById(decoded.id); // Fetch the user by ID
                if (!authenticatedUser) {
                    throw new Error("User not found");
                }
                req.user = authenticatedUser;
                next();
            }
        } catch (err) {
            throw new Error("Not authorized, token expired, please log in again.");
        }
    } else {
        throw new Error("There is no token in the header.");
    }
})


export const isAdmin = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    const adminUser = await user.findOne({ email: req.user.email });
    // console.log(adminUser.role)
    if (adminUser.role !== 'admin') {
        throw new Error("You are not an admin");
    } else {
        next();
    }
});