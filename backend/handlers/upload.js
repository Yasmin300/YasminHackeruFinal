import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/resumes folder exists
const uploadDir = path.join(process.cwd(), "../uploads/resumes");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
    },
});

export const resumeUpload = multer({ storage });
