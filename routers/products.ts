import express from "express";
import {ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";
import Product from "../models/Product";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
    try {
        const products  =  await Product.find();
        res.send(products);
    } catch (e) {
        next(e);
    }
});

productsRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    if (!req.params.id) {
        res.status(404).send('Not Found');
    }

    try {
        const product = await Product.findById(id);

        if (!product) res.status(404).send('Not Found');

        res.send(product);
    } catch (e) {
        next(e);
    }
});


productsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    // if (!req.body.title || !req.body.price || !req.body.category_id) {
    //     res.status(400).send({error: "Please send a title, price, category_id"});
    //     return;
    // }

    const newProduct: ProductWithoutId = {
        category_id: Number(req.body.category_id),
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

export default productsRouter;
