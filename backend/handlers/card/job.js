import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { resumeUpload } from "../upload.js"; // the file we just created
export const JWT_SECRET = process.env.JWT_SECRET;
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Job from '../schemas/job.js';
import {
    adminGuard,
    authGuard,
    registerGuard,
    userGuard,
    userAdminGuard,
    jobPosterGuard,
    jobOwnerOrAdminGuard,
    jobOwnerGuard
} from '../../Guards/guards.js';
import { jobSchema, jobEditSchema } from "../validations/jobValidation.js";

const router = Router();

// 🔍 Search & Filter jobs
router.get('/search', async (req, res, next) => {
    try {
        const {
            q,            // general text search
            industry,
            city,
            experienceLevel,
            minSalary,
            maxSalary,
            employmentType
        } = req.query;

        const filters = {};

        if (industry) filters.industry = { $regex: industry, $options: 'i' };
        if (city) filters['address.city'] = { $regex: city, $options: 'i' };
        if (experienceLevel) filters.experienceLevel = experienceLevel;
        if (employmentType) filters.employmentType = employmentType;

        if (minSalary || maxSalary) {
            filters['salaryRange.min'] = { $gte: Number(minSalary) || 0 };
            if (maxSalary) filters['salaryRange.max'] = { $lte: Number(maxSalary) };
        }

        if (q) {
            filters.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { companyName: { $regex: q, $options: 'i' } },
                { industry: { $regex: q, $options: 'i' } },
            ];
        }

        const jobs = await Job.find(filters);
        res.json(jobs);
    } catch (err) {
        next(new Error("Search failed: " + err.message));
    }
});


// Get all jobs
router.get('/', async (req, res, next) => {
    try {
        const data = await Job.find();
        res.send(data);
    } catch (err) {
        const error = new Error("Failed to retrieve jobs: " + err.message);
        error.status = 500;
        return next(error);
    }
});

// Get jobs created by logged-in user
router.get('/my-jobs', registerGuard, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userJobs = await Job.find({ postedBy: userId });
        res.send(userJobs);
    } catch (err) {
        const error = new Error("Failed to retrieve user jobs: " + err.message);
        error.status = 500;
        return next(error);
    }
});

// Get job by ID
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            const error = new Error("Job not found");
            error.status = 404;
            return next(error);
        }
        res.send(job);
    } catch (err) {
        const error = new Error("Invalid job ID: " + err.message);
        error.status = 400;
        return next(error);
    }
});

async function generateUniqueJobNumber() {
    let bizNumber;
    let exists = true;
    while (exists) {
        bizNumber = Math.floor(100000 + Math.random() * 900000);
        exists = await Job.findOne({ bizNumber });
    }
    return bizNumber;
}

// Create a new job (only for job posters)
router.post('/', jobPosterGuard, async (req, res, next) => {
    try {
        const { error } = jobSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            return next(err);
        }

        const jobNumber = await generateUniqueJobNumber();
        const job = new Job({
            ...req.body,
            jobNumber,
            postedBy: req.user._id,
            likes: []
        });
        const newJob = await job.save();
        res.status(201).send(newJob);
    } catch (err) {
        const error = new Error("Job creation failed: " + err.message);
        error.status = 400;
        return next(error);
    }
});

// Delete a job (owner or admin)
router.delete('/:id', jobOwnerOrAdminGuard, async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            const error = new Error("Job not found");
            error.status = 404;
            return next(error);
        }
        res.send(job);
    } catch (err) {
        const error = new Error("Error deleting job: " + err.message);
        error.status = 500;
        return next(error);
    }
});

// Edit a job (owner only)
router.put('/:id', jobOwnerGuard, async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            const error = new Error("Job not found");
            error.status = 400;
            return next(error);
        }
        const { error } = jobEditSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            return next(err);
        }
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedJob);
    } catch (err) {
        const error = new Error("Error updating job: " + err.message);
        error.status = 500;
        return next(error);
    }
});
// Like/unlike a job
router.patch('/:id', authGuard, async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            const error = new Error("Job not found");
            error.status = 400;
            return next(error);
        }
        const userId = req.user._id;
        const index = job.likes.indexOf(userId);
        if (index === -1) {
            job.likes.push(userId);
        } else {
            job.likes.splice(index, 1);
        }
        await job.save();
        res.send(job);
    } catch (err) {
        const error = new Error("Error updating job like: " + err.message);
        error.status = 400;
        return next(error);
    }
});
export default router;

