import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: null,
    },
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;