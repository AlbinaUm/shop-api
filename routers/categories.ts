import express from "express";

import Category from "../models/Category";
import permit from "../middleware/permit";
import auth from "../middleware/auth";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (e) {
        next(e);
    }
});

categoriesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
    const categoryData = {
        title: req.body.title,
        description: req.body.description,
    };

    try {
        const category = new Category(categoryData);
        await category.save();
        res.send(category);
    } catch (e) {
        next(e);
    }
});

export default categoriesRouter;
