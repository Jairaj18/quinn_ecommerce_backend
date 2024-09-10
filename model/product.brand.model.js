import mongoose from "mongoose";
var brandScheama = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
},{
    timestamps: true 
});

const productBrand = mongoose.model('Brand',brandScheama)
export default productBrand;