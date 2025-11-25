import bcrypt from "bcrypt";
import UserModel from './schemas/User.js';
import JobModel from './schemas/job.js';

async function insertInitialData() {
    // Check existing users
    let users = await UserModel.find();
    if (users.length === 0) {
        console.log("⚠️ No users found. Inserting initial users...");

        const initialUsers = [
            {
                name: { first: "Admin", middle: "", last: "User" },
                phone: "0501234567",
                email: "admin@example.com",
                password: await bcrypt.hash("Admin1234!", 10),
                address: { state: "", country: "Israel", city: "Tel Aviv", street: "Herzl", houseNumber: 10 },
                image: { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUsbmTZu_uMrmJ0z--CrG-o1UIXytu1OCizQ&s", alt: "Admin image" },
                isJobSeeker: false,
                isJobPoster: false,
                isAdmin: true
            },
            {
                name: { first: "Poster", middle: "", last: "User" },
                phone: "0507654321",
                email: "poster@example.com",
                password: await bcrypt.hash("Poster1234!", 10),
                address: { state: "", country: "Israel", city: "Haifa", street: "Hagana", houseNumber: 5 },
                image: { url: "https://cdn-icons-png.flaticon.com/512/847/847969.png", alt: "Job Poster image" },
                isJobSeeker: false,
                isJobPoster: true,
                isAdmin: false
            },
            {
                name: { first: "Seeker", middle: "", last: "User" },
                phone: "0501111111",
                email: "seeker@example.com",
                password: await bcrypt.hash("Seeker1234!", 10),
                address: { state: "", country: "Israel", city: "Jerusalem", street: "King George", houseNumber: 3 },
                image: { url: "https://cdn-icons-png.flaticon.com/512/149/149071.png", alt: "Job Seeker image" },
                isJobSeeker: true,
                isJobPoster: false,
                isAdmin: false
            }
        ];

        users = await UserModel.insertMany(initialUsers);
        console.log("✅ Initial users inserted.");
    } else {
        console.log(`ℹ️ Users already exist (${users.length} total).`);
    }

    // Insert jobs if none exist
    const jobCount = await JobModel.countDocuments();
    if (jobCount === 0) {
        console.log("⚠️ No jobs found. Inserting initial jobs...");

        // Try to find a Job Poster user
        const posterUser = users.find(u => u.isJobPoster);
        if (!posterUser) {
            console.warn("⚠️ No Job Poster user found. Jobs will have 'postedBy' as null.");
        }

        const initialJobs = [
            {
                title: "Frontend Developer",
                companyName: "Tech Corp",
                industry: "Software",
                employmentType: "Full-Time",
                experienceLevel: "Junior",
                salaryRange: { min: 9000, max: 12000, currency: "ILS" },
                description: "Work on cutting-edge web applications.",
                requirements: ["React", "JavaScript", "CSS"],
                benefits: ["Health Insurance", "Remote work"],
                remote: true,
                address: { state: "", country: "Israel", city: "Tel Aviv", street: "Herzl", houseNumber: 10, zip: 0 },
                postedBy: posterUser?._id || null,
                applicants: [],
                likes: []
            },
            {
                title: "Backend Developer",
                companyName: "Data Solutions",
                industry: "Software",
                employmentType: "Full-Time",
                experienceLevel: "Mid",
                salaryRange: { min: 11000, max: 15000, currency: "ILS" },
                description: "Develop APIs and manage databases.",
                requirements: ["Node.js", "MongoDB", "REST APIs"],
                benefits: ["Gym membership", "Paid leave"],
                remote: false,
                address: { state: "", country: "Israel", city: "Haifa", street: "Hagana", houseNumber: 5, zip: 0 },
                postedBy: posterUser?._id || null,
                applicants: [],
                likes: []
            }
        ];

        await JobModel.insertMany(initialJobs);
        console.log("✅ Initial jobs inserted.");
    } else {
        console.log(`ℹ️ Jobs already exist (${jobCount} total).`);
    }
}

export default insertInitialData;
