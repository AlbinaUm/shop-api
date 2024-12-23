import express from "express";
import {Category} from "../types";
import mysqlDb from "../mysqlDb";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM categories');
        const categories = result as Category[];

        res.send(categories);
    } catch (e) {
        next(e);
    }
});

export default categoriesRouter;
