import express from "express";
import {Product, ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT c.title AS category_title, p.*   from products AS p LEFT JOIN categories AS c on c.id = p.category_id ;');
        const products = result as Product[];

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
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
        const product = result as Product[];

        if (product.length === 0) {
            res.status(404).send("Product not found");
        } else {
            res.send(product[0]);
        }
    } catch (e) {
        next(e);
    }
});


productsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    if (!req.body.title || !req.body.price || !req.body.category_id) {
        res.status(400).send({error: "Please send a title, price, category_id"});
        return;
    }

    const product: ProductWithoutId = {
        category_id: Number(req.body.category_id),
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        image: req.file ? 'images' + req.file.filename : null,
    };

    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('INSERT INTO products (category_id, title, description, price, image) VALUES (?, ? , ?, ?, ?)',
            [product.category_id, product.title,  product.description, product.price, product.image]);

        const resultHeader = result as ResultSetHeader;

        const [resultOneProduct] = await connection.query('SELECT * FROM products WHERE id = ?', [resultHeader.insertId]);
        const oneProduct = resultOneProduct as Product[];

        if (oneProduct.length === 0) {
            res.status(404).send("Product not found");
        } else {
            res.send(oneProduct[0]);
        }
    } catch (e) {
        next(e);
    }
});

export default productsRouter;
