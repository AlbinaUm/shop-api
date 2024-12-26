import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: null,
    },
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;