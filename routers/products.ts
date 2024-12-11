import express from "express";
import fileDb from "../fileDb";
import {ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    const products = await fileDb.getItems();
    res.send(products);
});

productsRouter.get('/:id', async (req, res) => {
    const products = await fileDb.getItems(); // [{}, {}, {}, {}]
    const productFindById = products.find((product) => product.id === req.params.id);
    res.send(productFindById);
});


productsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.price) {
        res.status(400).send({error: "Please send a title and price"});
        return;
    }

    const product: ProductWithoutId = {
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        image: req.file ? 'images' + req.file.filename : null,
    };

    const savedProduct = await fileDb.addItem(product);
    res.send(savedProduct);
});

export default productsRouter;
