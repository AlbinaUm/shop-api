import express from "express";
import {ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";
import auth, {RequestWithUser} from "../middleware/auth";
import Cocktail from "../models/Cocktail";

const cocktailsRouter = express.Router();

cocktailsRouter.get('/', async (req, res, next) => {
    try {
        const cocktailsRouter  =  await Cocktail.find().populate("user");
        res.send(cocktailsRouter);
    } catch (e) {
        next(e);
    }
});


cocktailsRouter.post('/', imagesUpload.single('image'), auth,  async (req, res, next) => {
    const reqWithUser = req as RequestWithUser;

    const parsedIngredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];

    const newCocktail: ProductWithoutId = {
        user: reqWithUser.user._id,
        title: req.body.title,
        description: req.body.description,
        ingredients: parsedIngredients,
        image: req.file ? 'images' + req.file.filename : null,
    };

    try {
        const cocktail = new Cocktail(newCocktail);
        await cocktail.save();
        res.send(cocktail);
    } catch (e) {
        next(e);
    }
});

export default cocktailsRouter;
