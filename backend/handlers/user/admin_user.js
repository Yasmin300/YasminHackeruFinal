import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from "../validations/userValidation.js";
export const JWT_SECRET = process.env.JWT_SECRET;
import { adminGuard } from '../../Guards/guards.js';
import User from '../schemas/User.js';
const router = Router();

router.get('/', adminGuard, async (req, res) => {
    const data = await User.find();
    res.send(data);
});

// ✅ NEW: Toggle admin status (admin only)
router.patch("/:id/admin", adminGuard, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        // Prevent self-demotion
        if (user._id.toString() === req.user._id.toString()) {
            const error = new Error("You cannot change your own admin status");
            error.status = 403;
            return next(error);
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.send({
            message: `User admin status changed to ${user.isAdmin ? "Admin" : "Regular"}`,
            user
        });
    } catch (err) {
        const error = new Error("Error updating admin status: " + err.message);
        error.status = 500;
        return next(error);
    }
});


export default router;