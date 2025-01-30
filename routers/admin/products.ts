import express from "express";
import Product from "../../models/Product";
import {imagesUpload} from "../../multer";
import Category from "../../models/Category";
import {ProductWithoutId} from "../../types";


const productsAdminRouter = express.Router();

productsAdminRouter.get('/', async (req, res, next) => {
    try {
        const products  =  await Product.find().populate("category");
        res.send(products);
    } catch (e) {
        next(e);
    }
});

productsAdminRouter.post('/', imagesUpload.single('image'),  async (req, res, next) => {

    if (req.body.category) {
        const category = await Category.findById(req.body.category);
        if (!category) res.status(404).send('Not Found category');
    }

    const newProduct: ProductWithoutId = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.file ? 'images' + req.file.filename : null,
    };

    try {
        const product = new Product(newProduct);
        await product.save();
        res.send(product);
    } catch (e) {
        next(e);
    }
});

export default productsAdminRouter;
