import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./css/ShowJob.css";

export default function ShowJob() {
    const { jobId } = useParams();
    const { snackbar, setIsLoader, user, detoken, token } = useContext(MyContext);
    const [job, setJob] = useState({});
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);
    const navigate = useNavigate();

    // Fetch job details
    const getJob = async (id) => {
        setIsLoader(true);
        try {
            const res = await fetch(`http://localhost:3000/jobs/${id}`, {
                headers: { 'Authorization': token }
            });
            if (!res.ok) throw new Error("Cannot load job");
            const data = await res.json();
            setJob({
                ...data,
                favorite: user && data.likes?.includes(detoken._id)
            });
        } catch (err) {
            snackbar(err.message, "error");
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        if (jobId) getJob(jobId);
    }, [jobId]);

    // Handle favorite
    const toggleFavorite = async () => {
        try {
            const res = await fetch(`http://localhost:3000/jobs/${jobId}`, {
                headers: { 'Authorization': token },
                method: 'PATCH'
            });
            if (!res.ok) throw new Error("Failed to update favorite");
            getJob(jobId);
            snackbar("Updated favorite status", "success");
        } catch (err) {
            snackbar(err.message, "error");
        }
    };

    // Handle application submission
    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) return snackbar("Upload your resume first", "error");

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("coverLetter", coverLetter);

        try {
            setIsLoader(true);
            const res = await fetch(`http://localhost:3000/jobs/application/${jobId}/apply`, {
                method: "POST",
                headers: { 'Authorization': token },
                body: formData
            });
            const result = await res.json();
            if (!res.ok) {
                if (result.message?.includes("already applied")) {
                    snackbar("You already applied to this job", "info");
                    return;
                } else {
                    throw new Error(result.message || "Application failed");
                }
            }
            snackbar("Applied successfully!", "success");
            navigate(`/MyApplications`);
            setCoverLetter("");
            setResume(null);
        } catch (err) {
            snackbar(err.message, "error");
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <div className="jobPage">
            <h1>{job.title}</h1>
            <h3>{job.companyName} | {job.industry}</h3>

            <p><strong>Type:</strong> {job.employmentType} | <strong>Level:</strong> {job.experienceLevel}</p>
            <p><strong>Salary:</strong> {job.salaryRange?.min} - {job.salaryRange?.max} {job.salaryRange?.currency}</p>
            <p><strong>Remote:</strong> {job.remote ? "Yes" : "No"}</p>
            <p><strong>Description:</strong> {job.description}</p>

            <p><strong>Requirements:</strong></p>
            {job.requirements?.length > 0 ? (
                <ul>
                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
            ) : <p>None specified</p>}

            <p><strong>Benefits:</strong></p>
            {job.benefits?.length > 0 ? (
                <ul>
                    {job.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                </ul>
            ) : <p>None specified</p>}

            <p><strong>Address:</strong> {job.address?.street}, {job.address?.city}, {job.address?.state}, {job.address?.country} {job.address?.zip}</p>

            {user && (
                <i
                    className={`fas fa-heart ${job.favorite ? "fav" : ""}`}
                    onClick={toggleFavorite}
                    style={{ cursor: "pointer", fontSize: "24px", margin: "10px 0" }}
                ></i>
            )}

            {user && detoken?.isJobSeeker && (
                <form onSubmit={handleApply} style={{ marginTop: "20px" }}>
                    <label>
                        Upload Resume:
                        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResume(e.target.files[0])} />
                    </label>
                    <br />
                    <label>
                        Cover Letter:
                        <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Apply Now</button>
                </form>
            )}
        </div>
    );
}
