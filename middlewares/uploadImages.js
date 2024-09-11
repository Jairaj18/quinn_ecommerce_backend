import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const multerStorage = multer.diskStorage({
    destination: function(req,file , cb){
        cb(null, path.join(_dirname,'../public/images'));
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.filename +"-"+ Math.round(Math.random()*le9);
        cb(null, file.fieldname +"-"+uniqueSuffix+".jpeg");
     },
});

const multerFilter = (req,file, cb){
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb({message:"unsupported file format"},false)
    }
}

export const uploadPhoto = multer({
    storage : multerStorage,
    fileFilter : multerFilter,
    limits : {fieldSize: 2000000},
});

export const productImgResize = async (req, resizeBy, next) => {
    if (!req.files) return next();
    
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/products/${file.filename}`);
        })
    );

    next(); 
}


export const blogImgResize = async (req, resizeBy, next) => {
    if (!req.files) return next();
    
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/products/${file.filename}`);
        })
    );
    next(); 
}
