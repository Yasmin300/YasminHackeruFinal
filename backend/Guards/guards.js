import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../handlers/user/auth.js';
import Job from '../handlers/schemas/job.js'; // ✅ Import Job model

// Utility: decode token and attach req.user
const verifyToken = (req, next) => {
    let token = req.headers.authorization;

    if (!token) {
        const error = new Error("No token provided");
        error.status = 401;
        return { error };
    }

    // ✅ Support both "Bearer <token>" and plain "<token>"
    if (token.startsWith("Bearer ")) {
        token = token.slice(7); // remove "Bearer " prefix
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        if (!data._id) throw new Error("Token does not contain user ID");
        return { data };
    } catch (err) {
        const error = new Error("User is not authorized: " + err.message);
        error.status = 401;
        return { error };
    }
};


// General auth check
export const authGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    req.user = data;
    next();
};

// Admin-only access
export const adminGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (!data.isAdmin) {
        const err = new Error("Admin access only");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// Job poster-only access
export const jobPosterGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (!data.isJobPoster) {
        const err = new Error("Only job posters can perform this action");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// User can access only their own resource (or admin)
export const userAdminGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (!data.isAdmin && req.params.id !== data._id) {
        const err = new Error("Only the user themselves or admin can access this");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// Only exact user (no admin override)
export const userGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (req.params.id !== data._id) {
        const err = new Error("Only the user themselves can access this");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// Registered user (simple auth check)
export const registerGuard = authGuard;

// ✅ Job owner or admin
export const jobOwnerOrAdminGuard = async (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);

    const job = await Job.findById(req.params.id);
    if (!job) {
        const err = new Error("Job not found");
        err.status = 404;
        return next(err);
    }

    if (!data.isAdmin && job.postedBy.toString() !== data._id) {
        const err = new Error("Access denied. You can only modify your own job.");
        err.status = 403;
        return next(err);
    }

    req.user = data;
    req.job = job;
    next();
};

// ✅ Job owner only (no admin override)
export const jobOwnerGuard = async (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);

    const job = await Job.findById(req.params.id);
    if (!job) {
        const err = new Error("Job not found");
        err.status = 404;
        return next(err);
    }

    if (job.postedBy.toString() !== data._id) {
        const err = new Error("Only the job owner can access this");
        err.status = 403;
        return next(err);
    }

    req.user = data;
    req.job = job;
    next();
};

export const applicationOwnerGuard = async (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    const userId = req.user._id;

    const job = await Job.findById(req.params.id);
    if (!job) {
        const err = new Error("Job not found");
        err.status = 404;
        return next(err);
    }
    const application = job.applicants.find(app => app.user.toString() === userId.toString());
    if (!application) {
        const err = new Error("You are not allowed to withdraw this application");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    req.job = job;
    next();
};
