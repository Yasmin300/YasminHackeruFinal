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
    jobOwnerGuard,
    applicationOwnerGuard
} from '../../Guards/guards.js';
import { jobSchema, jobEditSchema } from "../validations/jobValidation.js";

const router = Router();
router.get("/my-applications", registerGuard, async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Find all jobs where this user has applied
        const jobs = await Job.find({ "applicants.user": userId })
            .select("title companyName applicants")
            .populate("postedBy", "fullName email");

        // Filter to include only this user's application details
        const applications = jobs.map(job => {
            const userApp = job.applicants.find(
                app => app.user.toString() === userId.toString()
            );
            return {
                jobId: job._id,
                jobTitle: job.title,
                companyName: job.companyName,
                status: userApp?.status || "pending",
                appliedAt: userApp?.appliedAt,
                coverLetter: userApp?.coverLetter,
                resumeUrl: userApp?.resumeUrl,
            };
        });


        res.status(200).json({ applications });
    } catch (err) {
        const error = new Error("Failed to fetch user applications: " + err.message);
        error.status = 500;
        return next(error);
    }
});


// Get all applicants for a specific job (owner or admin)
router.get("/:id/applicants", jobOwnerOrAdminGuard, async (req, res, next) => {
    const { id } = req.params;
    console.log(req.params);
    try {
        const job = await Job.findById(id)
            .populate("applicants.user", "name email phone skills experienceYears") // populate user info
            .populate("postedBy", "name email"); // optionally populate poster info

        if (!job) {
            const error = new Error("Job not found ");
            error.status = 404;
            return next(error);

        }
        res.status(200).json({ applicants: job.applicants });

    } catch (err) {
        const error = new Error(err.message);
        error.status = 404;
        return next(error);
    }
});


// Apply to a job
router.post("/:id/apply", registerGuard, resumeUpload.single("resume"), async (req, res, next) => {
    const { id } = req.params;
    const { coverLetter } = req.body;

    try {
        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        const alreadyApplied = job.applicants.some(app => app.user.toString() === req.user._id.toString());
        if (alreadyApplied) {
            const error = new Error("You already applied for this job ");
            error.status = 400;
            return next(error);
        }
        job.applicants.push({
            user: req.user._id,
            coverLetter,
            resumeUrl: req.file ? `/uploads/resumes/${req.file.filename}` : null,
        });
        await job.save();
        res.status(201).json({ message: "Application submitted successfully", job });
    } catch (err) {
        const error = new Error(err);
        error.status = 400;
        return next(error);
    }
});

// Withdraw (delete) user's own application
router.delete("/:id/withdraw", registerGuard, applicationOwnerGuard, async (req, res, next) => {
    const { id } = req.params; // job ID
    const userId = req.user._id;
    try {
        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        const index = job.applicants.findIndex(app => app.user.toString() === userId.toString());
        if (index === -1) return res.status(400).json({ message: "You haven't applied for this job" });

        const resumeUrl = job.applicants[index].resumeUrl;

        if (resumeUrl) {
            const filePath = path.join(process.cwd(), "..", resumeUrl.startsWith("/") ? resumeUrl.slice(1) : resumeUrl);

            fs.unlink(filePath, err => {
                if (err && err.code !== "ENOENT") {
                    console.error("Error deleting resume file:", err);
                } else {
                    console.log("✅ Deleted file:", filePath);
                }
            });
        }
        job.applicants.splice(index, 1);
        await job.save();
        res.status(200).json({ message: "Application withdrawn successfully" });
    } catch (err) {
        next(err);
    }
});
// Withdraw (delete) user's own application
router.patch("/:id/applicants/:applicantId/status", registerGuard, jobOwnerOrAdminGuard, async (req, res, next) => {
    const { id, applicantId } = req.params; // correctly extract params
    const { status } = req.body;
    console.log("jobId:", id);
    if (!["pending", "reviewed", "accepted", "rejected"].includes(status))
        return res.status(400).json({ message: "Invalid status value" });
    try {
        const job = await Job.findById(id);
        if (!job) return res.status(403).json({ message: "Job not found" });
        const applicant = job.applicants.find(app => app.user.toString() === applicantId);
        if (!applicant) return res.status(400).json({ message: "Applicant not found" });
        applicant.status = status;
        await job.save();
        res.status(200).json({ message: "Status updated successfully", applicant });
    } catch (err) {
        const error = new Error(err.message);
        error.status = 404;
        return next(error);
    }
});

export default router;
