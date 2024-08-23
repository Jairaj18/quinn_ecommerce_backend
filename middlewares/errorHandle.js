import { response } from "express";

// not found
export const notFound = (req, res,next)=>{
    const error = new Error(`Not FOund: ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// Error Handler

export const errorHandler = (err, req, res, next)=>{
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    })
}

