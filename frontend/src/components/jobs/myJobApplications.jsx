import { useEffect, useState, useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./css/MyApplications.css";
export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
    const { snackbar, setIsLoader, user, search, token, detoken, darkMode } = useContext(MyContext);

    const getApplications = async () => {
        try {
            const res = await fetch("http://localhost:3000/jobs/application/my-applications", {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error("Failed to fetch applications");

            const data = await res.json();
            setApplications(data.applications);
        } catch (err) {
            snackbar(err.message, "error");
        }
    };

    useEffect(() => {
        if (token) getApplications();
    }, [token]);

    const handleWithdraw = async (jobId) => {
        if (!window.confirm("Are you sure you want to withdraw your application?")) return;

        try {
            setIsLoader(true);
            const res = await fetch(`http://localhost:3000/jobs/application/${jobId}/withdraw`, {
                method: "DELETE",
                headers: { "Authorization": token }
            });

            if (!res.ok) throw new Error("Failed to withdraw application");

            snackbar("Application withdrawn successfully", "success");
            getApplications(); // refresh list
        } catch (err) {
            snackbar(err.message, "error");
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <div className={`my-applications-container ${darkMode ? "dark" : "light"}`}>
            <h1>My Applications</h1>
            <p className="subtitle">Track your applied jobs and their current status</p>
            <hr />

            {applications.length === 0 ? (
                <p className="no-apps">You haven’t applied to any jobs yet.</p>
            ) : (
                <div className="applications-list">
                    {applications.map((app, i) => (
                        <div className="application-card" key={i}>
                            <h3>{app.jobTitle}</h3>
                            <p className="company">{app.companyName}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status ${app.status}`}>{app.status}</span>
                            </p>
                            <p>
                                <strong>Applied on:</strong>{" "}
                                {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                            {app.coverLetter && (
                                <p className="cover-letter">
                                    <strong>Cover Letter:</strong> {app.coverLetter}
                                </p>
                            )}
                            {app.resumeUrl && (
                                <a
                                    href={`http://localhost:3000${app.resumeUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="resume-link"
                                >
                                    View Resume
                                </a>
                            )}
                            <button
                                className="withdraw-btn"
                                onClick={() => handleWithdraw(app.jobId)}
                            >
                                Withdraw Application
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
