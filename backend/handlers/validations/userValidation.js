import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין שם פרטי",
            "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
            "string.max": "שם פרטי יכול להכיל עד 256 תווים",
            "any.required": "שם פרטי הוא שדה חובה",
        }),
        middle: Joi.string().min(2).max(256).allow('').optional().messages({
            "string.min": "שם אמצעי חייב להכיל לפחות 2 תווים",
            "string.max": "שם אמצעי יכול להכיל עד 256 תווים",
        }),
        last: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין שם משפחה",
            "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
            "string.max": "שם משפחה יכול להכיל עד 256 תווים",
            "any.required": "שם משפחה הוא שדה חובה",
        }),
    }).required().messages({
        "any.required": "יש לספק אובייקט שם",
    }),

    phone: Joi.string().pattern(/^0\d{8,9}$/).required().messages({
        "string.empty": "יש להזין טלפון",
        "string.pattern.base": "מספר טלפון חייב להיות ישראלי תקני (למשל: 0501234567, 031234567)",
        "any.required": "טלפון הוא שדה חובה",
    }),

    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.empty": "יש להזין אימייל",
        "string.email": "אימייל לא תקין",
        "any.required": "אימייל הוא שדה חובה",
    }),

    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-]).{9,}$/)
        .required()
        .messages({
            "string.empty": "יש להזין סיסמה",
            "string.pattern.base":
                "הסיסמה צריכה להיות לפחות 9 תווים, עם אות גדולה, אות קטנה, מספר ותו מיוחד (!@#$%^&*-)",
            "any.required": "סיסמה היא שדה חובה",
        }),

    image: Joi.object({
        url: Joi.string().uri().allow('').optional().messages({
            "string.uri": "קישור לתמונה לא תקין",
        }),
        alt: Joi.string().min(2).max(256).allow('').optional().messages({
            "string.min": "תיאור התמונה חייב להכיל לפחות 2 תווים",
            "string.max": "תיאור התמונה יכול להכיל עד 256 תווים",
        }),
    })
        .optional()
        .with('url', 'alt')  // if url exists → alt must exist
        .with('alt', 'url'),

    address: Joi.object({
        state: Joi.string().min(2).max(256).allow('').messages({
            "string.min": "שם היישוב חייב להכיל לפחות 2 תווים",
            "string.max": "שם היישוב יכול להכיל עד 256 תווים",
        }),
        country: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין מדינה",
            "string.min": "שם המדינה חייב להכיל לפחות 2 תווים",
            "string.max": "שם המדינה יכול להכיל עד 256 תווים",
            "any.required": "מדינה היא שדה חובה",
        }),
        city: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין עיר",
            "string.min": "שם העיר חייב להכיל לפחות 2 תווים",
            "string.max": "שם העיר יכול להכיל עד 256 תווים",
            "any.required": "עיר היא שדה חובה",
        }),
        street: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין רחוב",
            "string.min": "שם הרחוב חייב להכיל לפחות 2 תווים",
            "string.max": "שם הרחוב יכול להכיל עד 256 תווים",
            "any.required": "רחוב הוא שדה חובה",
        }),
        houseNumber: Joi.number().min(1).required().messages({
            "number.base": "מספר בית חייב להיות מספר",
            "number.min": "מספר בית חייב להיות גדול מ-0",
            "any.required": "מספר בית הוא שדה חובה",
        }),
        zip: Joi.number().min(1).optional().messages({
            "number.base": "מיקוד חייב להיות מספר",
            "number.min": "מיקוד חייב להיות גדול מ-0",
        }),
    }).required().messages({
        "any.required": "יש לספק אובייקט כתובת",
    }),

    isJobSeeker: Joi.boolean().required().messages({
        "any.required": "יש לציין אם המשתמש הוא מחפש עבודה או לא",
        "boolean.base": "שדה מחפש עבודה חייב להיות בוליאני",
    }),
    industry: Joi.string().min(2).max(256).required().messages({
        "string.empty": "יש להזין תחום עיסוק",
        "string.min": "תחום העיסוק חייב להכיל לפחות 2 תווים",
        "string.max": "תחום העיסוק יכול להכיל עד 256 תווים",
        "any.required": "תחום העיסוק הוא שדה חובה",
    }),
});

// Login schema
export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.email": "אימייל לא תקין",
        "string.empty": "יש להזין אימייל",
    }),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-]).{9,}$/)
        .required()
        .messages({
            "string.empty": "יש להזין סיסמה",
            "string.pattern.base":
                "הסיסמה צריכה להיות לפחות 9 תווים, עם אות גדולה, אות קטנה, מספר ותו מיוחד (!@#$%^&*-)",
        }),
});
export const editSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין שם פרטי",
            "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
            "string.max": "שם פרטי יכול להכיל עד 256 תווים",
            "any.required": "שם פרטי הוא שדה חובה",
        }),
        middle: Joi.string().min(2).max(256).allow('').optional().messages({
            "string.min": "שם אמצעי חייב להכיל לפחות 2 תווים",
            "string.max": "שם אמצעי יכול להכיל עד 256 תווים",
        }),
        last: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין שם משפחה",
            "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
            "string.max": "שם משפחה יכול להכיל עד 256 תווים",
            "any.required": "שם משפחה הוא שדה חובה",
        }),
    }).required().messages({
        "any.required": "יש לספק אובייקט שם",
    }),

    phone: Joi.string().pattern(/^0\d{8,9}$/).required().messages({
        "string.empty": "יש להזין טלפון",
        "string.pattern.base": "מספר טלפון חייב להיות ישראלי תקני (למשל: 0501234567, 031234567)",
        "any.required": "טלפון הוא שדה חובה",
    }),
    image: Joi.object({
        url: Joi.string().uri().allow('').optional().messages({
            "string.uri": "קישור לתמונה לא תקין",
        }),
        alt: Joi.string().min(2).max(256).allow('').optional().messages({
            "string.min": "תיאור התמונה חייב להכיל לפחות 2 תווים",
            "string.max": "תיאור התמונה יכול להכיל עד 256 תווים",
        }),
    })
        .optional()
        .with('url', 'alt')  // if url exists → alt must exist
        .with('alt', 'url'),

    address: Joi.object({
        state: Joi.string().min(2).max(256).allow('').messages({
            "string.min": "שם היישוב חייב להכיל לפחות 2 תווים",
            "string.max": "שם היישוב יכול להכיל עד 256 תווים",
        }),
        country: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין מדינה",
            "string.min": "שם המדינה חייב להכיל לפחות 2 תווים",
            "string.max": "שם המדינה יכול להכיל עד 256 תווים",
            "any.required": "מדינה היא שדה חובה",
        }),
        city: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין עיר",
            "string.min": "שם העיר חייב להכיל לפחות 2 תווים",
            "string.max": "שם העיר יכול להכיל עד 256 תווים",
            "any.required": "עיר היא שדה חובה",
        }),
        street: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין רחוב",
            "string.min": "שם הרחוב חייב להכיל לפחות 2 תווים",
            "string.max": "שם הרחוב יכול להכיל עד 256 תווים",
            "any.required": "רחוב הוא שדה חובה",
        }),
        houseNumber: Joi.number().min(1).required().messages({
            "number.base": "מספר בית חייב להיות מספר",
            "number.min": "מספר בית חייב להיות גדול מ-0",
            "any.required": "מספר בית הוא שדה חובה",
        }),
        zip: Joi.number().min(1).optional().messages({
            "number.base": "מיקוד חייב להיות מספר",
            "number.min": "מיקוד חייב להיות גדול מ-0",
        }),

    }).required().messages({
        "any.required": "יש לספק אובייקט כתובת",
    }),
});
