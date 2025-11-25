import Joi from "joi";

// 🆕 Full create validation
export const jobSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    companyName: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    requirements: Joi.array().items(Joi.string().min(2)).default([]),
    salaryRange: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string().default("ILS")
    }),
    employmentType: Joi.string().valid("Full-Time", "Part-Time", "Contract", "Internship", "Temporary", "Freelance").required(),
    experienceLevel: Joi.string().valid("Entry", "Junior", "Mid", "Senior", "Lead").required(),
    remote: Joi.boolean().default(false),
    address: Joi.object({
        state: Joi.string().allow(""),
        country: Joi.string().allow(""),
        city: Joi.string().allow(""),
        street: Joi.string().allow(""),
        houseNumber: Joi.number().min(1),
        zip: Joi.number().min(0).default(0),
    }).default({}),
    benefits: Joi.array().items(Joi.string()).default([]),
    industry: Joi.string().min(2).max(256).required()
});

// 🧾 Edit validation (more flexible)
export const jobEditSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    companyName: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    requirements: Joi.array().items(Joi.string().min(2)).default([]),
    salaryRange: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string().default("ILS")
    }),
    employmentType: Joi.string().valid("Full-Time", "Part-Time", "Contract", "Internship", "Temporary", "Freelance").required(),
    experienceLevel: Joi.string().valid("Entry", "Junior", "Mid", "Senior", "Lead").required(),
    remote: Joi.boolean().default(false),
    address: Joi.object({
        state: Joi.string().allow(""),
        country: Joi.string().allow(""),
        city: Joi.string().allow(""),
        street: Joi.string().allow(""),
        houseNumber: Joi.number().min(1),
        zip: Joi.number().min(0).default(0),
    }).default({}),
    benefits: Joi.array().items(Joi.string()).default([]),
    industry: Joi.string().min(2).max(256).required()
});
