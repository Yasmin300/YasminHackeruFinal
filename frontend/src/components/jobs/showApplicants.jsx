import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../../App";
import "./css/application.css";

export default function JobApplicants() {
    const { jobId } = useParams();
    const { token, detoken, snackbar } = useContext(MyContext);
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        if (!token) return;
        getApplicants();
    }, [jobId, token]);

    const getApplicants = async () => {
        try {
            const res = await fetch(`http://localhost:3000/jobs/application/${jobId}/applicants`, {
                headers: { "Authorization": token }
            });
            if (!res.ok) throw new Error("Failed to fetch applicants");
            const data = await res.json();
            setApplicants(data.applicants);
        } catch (err) {
            console.error(err);
            snackbar(err.message, "error");
        }
    };

    return (
        <div className="my-applications-container">
            <h1>Applicants</h1>
            <p className="subtitle">Here you can manage all applicants for this job</p>

            {applicants.length === 0 ? (
                <p className="no-apps">No applicants yet.</p>
            ) : (
                <ul className="applications-list">
                    {applicants.map((app, i) => (
                        <li key={i} className="application-card">
                            <h3>{app.user.name?.first} {app.user.name?.last}</h3>
                            <p className="company">{app.user.email}</p>
                            <p>Phone: {app.user.phone}</p>
                            <p>Skills: {app.user.skills.join(", ")}</p>
                            <p>Experience: {app.user.experienceYears} years</p>
                            <p className="cover-letter">Cover Letter: {app.coverLetter}</p>

                            {app.resumeUrl && (
                                <a href={`http://localhost:3000${app.resumeUrl}`} target="_blank" rel="noreferrer" className="app-resume-link">
                                    Resume Link
                                </a>
                            )}

                            <div className="application-card-actions" style={{ marginTop: "20px" }}>
                                <select
                                    value={app.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value;
                                        try {
                                            const res = await fetch(`http://localhost:3000/jobs/application/${jobId}/applicants/${app.user._id}/status`,
                                                {
                                                    method: "PATCH",
                                                    headers: { "Authorization": token, "Content-Type": "application/json" },
                                                    body: JSON.stringify({ status: newStatus })
                                                });
                                            if (!res.ok) throw new Error("Failed to update status");
                                            snackbar("Status updated!", "success");
                                            getApplicants();
                                        }
                                        catch (err) { snackbar(err.message, "error"); }
                                    }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <span className={`status ${app.status}`} style={{ marginLeft: "10px" }}>
                                    {app.status}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    )
}
