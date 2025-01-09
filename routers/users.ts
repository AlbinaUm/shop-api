import express from "express";
import {Error} from "mongoose";
import User from "../models/User";


const userRouter = express.Router();


userRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateToken();

        await user.save();
        res.send(user);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});

userRouter.post('/sessions', async (req, res, next) => {
    try {
       const user = await User.findOne({username: req.body.username});

       if (!user) {
           res.status(400).send({error: 'Username not found'});
           return;
       }

       const isMatch = await user.checkPassword(req.body.password);

       if (!isMatch) {
           res.status(400).send({error: 'Password is wrong!'});
           return;
       }

       user.generateToken();
       await user.save();

       res.send({message: 'Username and password is correct', user});

    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});

userRouter.post('/secret', async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        res.status(401).send({error: 'No token present'});
        return;
    }

    const user = await User.findOne({token});

    if (!user) {
        res.status(401).send({error: 'Wrong token'});
        return;
    }

    res.send({message: 'Secret material from Attractor', username: user.username, id_user: user._id});
});

export default userRouter;
