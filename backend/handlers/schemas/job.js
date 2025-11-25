import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: Number,
    zip: {
        type: Number,
        default: 0
    }
}, { _id: false });

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true
    },
    employmentType: { // full-time, part-time, internship, contract, etc.
        type: String,
        enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Temporary", "Freelance"],
        required: true
    },
    experienceLevel: { // junior, mid, senior
        type: String,
        enum: ["Entry", "Junior", "Mid", "Senior", "Lead"],
        required: true
    },
    salaryRange: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: "ILS" }
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    requirements: [String],  // Array of strings (skills, qualifications)
    benefits: [String],      // Optional perks / advantages
    remote: {
        type: Boolean,
        default: false
    },
    address: AddressSchema, // Job location (optional for remote)

    // 🔹 The user who created this job (a job poster)
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    // 🔹 Applications — job seekers who applied
    applicants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        appliedAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["pending", "reviewed", "accepted", "rejected"],
            default: "pending"
        },
        coverLetter: String,
        resumeUrl: String // <-- added here
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // <--- favorite jobs
    // 🔹 Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }

});

JobSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("jobs", JobSchema);
