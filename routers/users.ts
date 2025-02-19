import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";

const client = new OAuth2Client(config.google.clientId);

const userRouter = express.Router();
userRouter.post('/facebook', async (req, res, next) => {
   try {
       const {accessToken, userID} = req.body;
       if (!accessToken && !userID) {
           res.status(400).send({error: "Access token and userId must be in req"});
           return;
       }

       const url = `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`;
       const response = await fetch(url);

       if (!response.ok) {
           res.status(400).send({error: "Invalid Facebook user data"});
           return;
       }

       const fbData = await response.json();

       if (!fbData || fbData.id !== userID) {
           res.status(400).send({error: "Invalid Facebook ID"});
           return;
       }

       const facebookID = fbData.id;

       let user = await User.findOne({email: fbData.email});

       if (!user) {
           const newPassword = crypto.randomUUID();
           user = new User({
               username: fbData.name,
               email: fbData.email,
               password: newPassword,
               confirmPassword: newPassword,
               facebookID,
           });
       }

       user.generateToken();
       user.facebookID = facebookID;
       await user.save();
       res.send({message: 'Login with facebook success!', user});
   } catch (e) {
       next(e);
   }
});

userRouter.post("/google", async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });


        const payload = ticket.getPayload();

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

        let user = await User.findOne({email: email});

        if (!user) {
            const newPassword =  crypto.randomUUID();
            user = new User({
                username: displayName,
                email: email,
                password: newPassword,
                confirmPassword: newPassword,
                googleID: id,
                displayName,
            });
        }

        user.generateToken();
        user.googleID = id;
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
            confirmPassword: req.body.confirmPassword,
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
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            res.status(400).send({error: 'Email not found'});
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
