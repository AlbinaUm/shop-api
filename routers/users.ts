import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";

const client = new OAuth2Client(config.google.clientId);

const userRouter = express.Router();
const FC_SECRET = '608f9c731e89f17a832f1cc58cf62881';
const FC_ID = '612634465059437';

userRouter.post("/facebook", async (req, res, next) => {
    try {
        const { accessToken, userID } = req.body;

        // Запрос к Facebook API с использованием fetch
        const fbUrl = `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`;
        const response = await fetch(fbUrl);

        if (!response.ok) {
            res.status(400).send({ error: "Invalid Facebook token" });
            return;
        }

        const fbData = await response.json();

        if (!fbData || fbData.id !== userID) {
            res.status(400).send({ error: "Invalid Facebook user data" });
            return;
        }

        const email = fbData.email || `${fbData.id}@facebook.com`; // Заглушка, если email не передается
        const displayName = fbData.name;
        const facebookID = fbData.id;

        let user = await User.findOne({ facebookID });

        if (!user) {
            user = new User({
                username: email,
                password: crypto.randomUUID(),
                facebookID,
                displayName,
            });
        }

        user.generateToken();
        await user.save();

        res.send({ message: "Login with Facebook success!", user });
    } catch (error) {
        next(error);
    }
});

userRouter.post("/google", async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });


        const payload = ticket.getPayload();

        console.log(payload);

        if (!payload) {
            res.status(400).send({error: "Invalid credential. Google login error!"});
            return;
        }

        const email = payload.email;
        const id = payload.sub; // googleID
        const displayName = payload.name;

        if (!email) {
            res.status(400).send({error: "No enough user data to continue"});
            return;
        }

        let user = await User.findOne({googleID: id});

        if (!user) {
            user = new User({
                username: email,
                password: crypto.randomUUID(),
                googleID: id,
                displayName,
            });
        }

        user.generateToken();
        await user.save();
        res.send({message: 'Login with Google success!', user});
    } catch (e) {
        next(e);
    }
});


userRouter.post('/register', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        user.generateToken();

        await user.save();
        res.send({user, message: "Register success"});
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

userRouter.delete('/sessions', auth, async (req, res, next) => {
    let reqWithAuth = req as RequestWithUser;
    const userFromAuth = reqWithAuth.user;

    try {
        const user = await User.findOne({_id: userFromAuth._id});
        if (user) {
            user.generateToken();
            await user.save();
            res.send({message: 'Success logout'});
        }
    } catch (e) {
        next(e);
    }
});


userRouter.post('/secret', auth, async (req, res) => {
    let expressReq = req as RequestWithUser;

    const user = expressReq.user;

    console.log(user);

    res.send({message: 'Secret material from Attractor', user: user});
});


export default userRouter;
