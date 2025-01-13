import mongoose from "mongoose";
import config from "./config";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";
import {randomUUID} from "node:crypto";


const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('categories');
        await db.dropCollection('products');
        await db.dropCollection('users');
    } catch (e) {
        console.log('Collections were not presents, skipping drop ');
    }

    const [cpuCategory, SSDCategory] = await Category.create(
        {
            title: 'CPU',
            description: 'Test desc for CPU'
        },
        {
            title: 'SSD',
            description: 'Test desc for SSD ...'
        });

    await Product.create({
            category: cpuCategory._id,
            title: 'Intel',
            price: 350,
            image: "fixtures/cpu.jpg",
        },
        {
            category: cpuCategory._id,
            title: 'Apple',
            price: 700,
        },
        {
            category: SSDCategory._id,
            title: 'Lenovo',
            price: 500,
            image: "fixtures/ssd.jpg",
        });

    await User.create({
            username: "Jane",
            password: "123",
            token: randomUUID(),
        },
        {
            username: "John",
            password: "123",
            token: randomUUID(),
        });

    await db.close();
};

run().catch(console.error);