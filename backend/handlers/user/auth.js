import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from "../validations/userValidation.js";
export const JWT_SECRET = (() => {
    if (!process.env.JWT_SECRET) {
        throw new Error("❌ Missing JWT_SECRET in environment");
    }
    return process.env.JWT_SECRET;
})();
import { authGuard } from '../../Guards/guards.js';
import User from '../schemas/User.js';
const router = Router();

router.post('/login', async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.status = 400;
        return next(err);
    }
    const { email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (!userFind) {
        const error = new Error("email or password incorrect");
        error.status = 403;
        return next(error);
    }
    if (userFind.lockUntil && userFind.lockUntil > Date.now()) {
        const err = new Error("Account is locked. Try again later.After : " + userFind.lockUntil);
        err.status = 403;
        return next(err);
    }

    const passwordMatch = await bcrypt.compare(password, userFind.password);

    if (!passwordMatch) {
        userFind.loginAttempts += 1;
        if (userFind.loginAttempts >= 3) {
            userFind.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
            userFind.loginAttempts = 0;
        }
        await userFind.save();
        const error = new Error("email or password incorrect");
        error.status = 403;
        return next(error);
    }
    userFind.loginAttempts = 0;
    userFind.lockUntil = null;
    await userFind.save();
    const obj = {
        _id: userFind._id,
        isJobPoster: userFind.isJobPoster,
        isJobSeeker: userFind.isJobSeeker,
        isAdmin: userFind.isAdmin,
        fullName: `${userFind.firstName} ${userFind.lastName}`,
    };
    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(obj, JWT_SECRET, { expiresIn: '4h' });
    res.status(200).json({
        token,
        refreshToken,
        message: "Login successful"
    });
});

router.post('/', async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            return next(err);
        }

        let {
            name: { first, middle, last },
            isJobSeeker,
            industry,
            phone,
            email,
            password,
            address: { state, country, city, street, houseNumber, zip },
            image: { url, alt }
        } = req.body;

        isJobSeeker = isJobSeeker === true || isJobSeeker === "true"; // now works
        const isJobPoster = !isJobSeeker;
        ;

        const userFind = await User.findOne({ email });
        if (userFind) {
            const error = new Error("Email is already in use");
            error.status = 403;
            return next(error);
        }

        // 🔹 Automatically set jobPoster opposite of jobSeeker

        const user = new User({
            name: { first, middle, last },
            email,
            phone,
            password: await bcrypt.hash(password, 10),
            address: { state, country, city, street, houseNumber, zip },
            image: { url, alt },
            industry,
            isJobSeeker,
            isJobPoster,
            isAdmin: false
        });

        const newUser = await user.save();
        res.status(201).send(newUser);

    } catch (err) {
        next(err);
    }
});

router.get('/token', authGuard, async (req, res) => {
    const data = jwt.decode(req.headers.authorization);
    const obj = {
        _id: data._id,
        isBusiness: data.isBusiness,
        isAdmin: data.isAdmin,
    };
    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });

    res.send(token);
});

router.post('/refresh', async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send("Missing refresh token");

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);

        // create new 15min token
        const newAccessToken = jwt.sign(
            {
                _id: decoded._id,
                isJobPoster: decoded.isJobPoster,
                isJobSeeker: decoded.isJobSeeker,
                isAdmin: decoded.isAdmin,
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ token: newAccessToken });
    } catch (err) {
        return res.status(403).send("Refresh token expired or invalid");
    }
});


export default router;