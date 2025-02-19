import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CocktailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: String,
    isPublished: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: null,
    },
    ingredients: [{
        name: {type: String, required: true},
        amount: {type: Number, required: true},
    }]
});

const Cocktail = mongoose.model('Cocktail', CocktailSchema);
export default Cocktail;