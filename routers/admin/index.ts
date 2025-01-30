import express from "express";
import auth from "../../middleware/auth";
import permit from "../../middleware/permit";
import productsAdminRouter from "./products";


const adminRouter = express.Router(); // admin

// localhost/admin/products

adminRouter.use(auth, permit('admin'));
adminRouter.use('/products', productsAdminRouter);

export default adminRouter;