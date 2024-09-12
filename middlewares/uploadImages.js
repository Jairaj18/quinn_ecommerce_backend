import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file format"), false); 
    }
};

export const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});


export const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
  
    try {
      await Promise.all(
        req.files.map(async (file) => {
          const resizedPath = `public/images/products/${file.filename}`;
          await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(resizedPath);
          fs.unlinkSync(file.path); // Delete the original file after resizing
        })
      );
      console.log("Resizing completed");
      next();
    } catch (error) {
      console.error('Error resizing product images:', error);
      return res.status(500).json({ message: 'Error resizing images.' });
    }
  };
  export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
  
    try {
      await Promise.all(
        req.files.map(async (file) => {
          const resizedPath = `public/images/blogs/${file.filename}`;
          await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(resizedPath);
          fs.unlinkSync(file.path); // Delete the original file after resizing
        })
      );
      next();
    } catch (error) {
      console.error('Error resizing blog images:', error);
      return res.status(500).json({ message: 'Error resizing images.' });
    }
  };