import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { editSchema } from "../validations/userValidation.js";
export const JWT_SECRET = process.env.JWT_SECRET;
import { userGuard, userAdminGuard } from '../../Guards/guards.js';
import User from '../schemas/User.js';
const router = Router();

router.get('/:id', userAdminGuard, async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        res.send(user);
    } catch (err) {
        const error = new Error("Invalid user ID");
        error.status = 400;
        return next(error);
    }
});
router.delete('/:id', userAdminGuard, async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }
        res.send({ message: "User deleted successfully", user });
    } catch (err) {
        const error = new Error("Error deleting user" + err.message);
        error.status = 500;
        return next(error);
    }
});
router.put('/:id', userGuard, async (req, res, next) => {
    const data = await User.findById(req.params.id);
    if (!data) {
        const error = new Error("User not found");
        error.status = 400;
        return next(error);
    }
    const { err } = editSchema.validate(req.body);
    if (err) {
        const error = new Error(err.details[0].message);
        error.status = 400;
        return next(error);
    }
    const {
        name: { first, middle, last },
        phone,
        address: { state, country, city, street, houseNumber, zip },
        image: { url, alt }
    } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: {
                    first: first,
                    middle: middle,
                    last: last
                },
                phone: phone,
                address: {
                    state: state,
                    country: country,
                    city: city,
                    street: street,
                    houseNumber: houseNumber,
                    zip: zip
                },
                image: {
                    url: url,
                    alt: alt
                },
            },
            { new: true }
        );
        res.send(updatedUser);
    }
    catch {
        const error = new Error("Error updating user" + err.message);
        error.status = 400;
        return next(error);
    }
});
router.patch('/:id', userGuard, async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        const error = new Error("User not found");
        error.status = 400;
        return next(error);
    }
    user.isBusiness = !user.isBusiness;
    try {
        await user.save();
        res.send(user);
    }
    catch {
        const error = new Error("Error updating user's business status" + err.message);
        error.status = 400;
        return next(error);
    }
});
export default router;
