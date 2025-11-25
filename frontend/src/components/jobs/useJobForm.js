import { useState, useEffect } from "react";
import Joi from "joi";

const defaultForm = {
    title: "",
    companyName: "",
    industry: "",
    employmentType: "Full-Time",
    experienceLevel: "Entry",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "ILS",
    description: "",
    requirements: "",
    benefits: "",
    remote: false,
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: ""
};

const schema = Joi.object({
    title: Joi.string().min(2).max(256).required().messages({
        "string.empty": "יש להזין כותרת",
        "string.min": "כותרת חייבת להכיל לפחות 2 תווים",
    }),
    companyName: Joi.string().min(2).max(256).required().messages({
        "string.empty": "יש להזין שם חברה",
        "string.min": "שם החברה חייב להכיל לפחות 2 תווים",
    }),
    industry: Joi.string().min(2).max(256).required().messages({
        "string.empty": "יש להזין תחום",
        "string.min": "תחום חייב להכיל לפחות 2 תווים",
    }),
    employmentType: Joi.string().valid("Full-Time", "Part-Time", "Internship", "Contract", "Temporary", "Freelance").required(),
    experienceLevel: Joi.string().valid("Entry", "Junior", "Mid", "Senior", "Lead").required(),
    salaryMin: Joi.number().min(0).allow(null, "").messages({
        "number.base": "שכר מינימום חייב להיות מספר",
        "number.min": "שכר מינימום חייב להיות לא שלילי"
    }),
    salaryMax: Joi.number().min(0).allow(null, "").messages({
        "number.base": "שכר מקסימום חייב להיות מספר",
        "number.min": "שכר מקסימום חייב להיות לא שלילי"
    }),
    salaryCurrency: Joi.string().min(2).max(5).required(),
    description: Joi.string().min(20).required().messages({
        "string.empty": "יש להזין תיאור",
        "string.min": "תיאור חייב להכיל לפחות 20 תווים"
    }),
    requirements: Joi.string().allow(""), // comma-separated
    benefits: Joi.string().allow(""),     // comma-separated
    remote: Joi.boolean(),
    state: Joi.string().allow(""),
    country: Joi.string().required().messages({ "string.empty": "יש להזין מדינה" }),
    city: Joi.string().required().messages({ "string.empty": "יש להזין עיר" }),
    street: Joi.string().required().messages({ "string.empty": "יש להזין רחוב" }),
    houseNumber: Joi.number().min(1).required().messages({
        "number.base": "מספר בית חייב להיות מספר",
        "number.min": "מספר בית חייב להיות גדול מ-0"
    }),
    zip: Joi.number().allow(null, "").messages({
        "number.base": "מיקוד חייב להיות מספר"
    }),
});

export function useJobForm(initial = defaultForm) {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let parsed;

        if (type === "checkbox") parsed = checked;
        else if (["houseNumber", "zip", "salaryMin", "salaryMax"].includes(name)) parsed = value === "" ? null : Number(value);
        else parsed = value;

        setForm(prev => ({ ...prev, [name]: parsed }));
    };

    const resetForm = () => setForm(defaultForm);

    useEffect(() => {
        const { error } = schema.validate(form, { abortEarly: false });
        if (error) {
            const newErrors = {};
            error.details.forEach(e => {
                newErrors[e.path[0]] = e.message;
            });
            setErrors(newErrors);
            setIsValid(false);
        } else {
            setErrors({});
            setIsValid(true);
        }
    }, [form]);

    return { form, setForm, handleChange, resetForm, isValid, errors };
}
