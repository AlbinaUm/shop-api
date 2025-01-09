import express from "express";
import productsRouter from "./routers/products";
import fileDb from "./fileDb";
import cors from "cors";
import categoriesRouter from "./routers/categories";
import mongoDb from "./mongoDb";
import * as mongoose from "mongoose";
import fs = require("fs");
import userRouter from "./routers/users";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', userRouter);

const run = async () => {
    await mongoose.connect('mongodb://localhost/shop2');

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });

    process.on('exit', () => {
       mongoDb.disconnect();
    });
};

run().catch(err => console.log(err));


