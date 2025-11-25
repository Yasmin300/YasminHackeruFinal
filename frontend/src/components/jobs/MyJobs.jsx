import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import "./css/job.css";
import Pagination from "../pagination/Pagination";

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const { snackbar, setIsLoader, user, search, token, detoken } = useContext(MyContext);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 15;
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getJobs = async () => {
        console.log("Fetching my jobs with token:", token);

        setIsLoader(true);
        try {
            const res = await fetch('http://localhost:3000/jobs/my-jobs', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (err) {
            snackbar("שגיאה בקבלת המשרות שלך", "error");
        } finally {
            setIsLoader(false);
        }
    };

    const handleEdit = (id) => navigate(`/editJob/${id}`);
    const addJob = () => navigate('/addJob');

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        setIsLoader(true);
        try {
            const res = await fetch(`http://localhost:3000/jobs/${id}`, {
                headers: { 'Authorization': token },
                method: 'DELETE',
            });

            if (res.ok) {
                snackbar("המשרה נמחקה בהצלחה", "success");
                await getJobs();
            } else {
                snackbar("מחיקת המשרה נכשלה", "error");
            }
        } catch (err) {
            console.error("Delete error:", err);
            snackbar("שגיאה בעת מחיקת המשרה", "error");
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        if (!token) return; // wait until token is loaded
        getJobs();
    }, [token]);

    function filterJobs(job, search) {
        if (search) {
            return job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase()) ||
                job.companyName.toLowerCase().includes(search.toLowerCase()) ||
                job.industry.toLowerCase().includes(search.toLowerCase());
        }
        return true;
    }

    const filteredJobs = jobs.filter(job => filterJobs(job, search));
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    return (
        <div className="Jobs">
            <h1>My Jobs Page</h1>
            <h2>Here you can find all your posted jobs</h2>
            <hr />
            <div className="JobsContainer">
                {currentJobs.map(job => (
                    <div key={job._id} id={job._id}>
                        <div className="JobList">
                            <h3>{job.title}</h3>
                            <p><strong>Company:</strong> {job.companyName}</p>
                            <p><strong>Industry:</strong> {job.industry}</p>
                            <p><strong>Type:</strong> {job.employmentType} | <strong>Level:</strong> {job.experienceLevel}</p>
                            <p><strong>Salary:</strong> {job.salaryRange?.min} - {job.salaryRange?.max} {job.salaryRange?.currency}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Address:</strong> {job.address?.street} {job.address?.houseNumber}, {job.address?.city}, {job.address?.state}, {job.address?.zip}, {job.address?.country}</p>

                            {detoken && (detoken?.isJobPoster || detoken?.isAdmin) && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <i
                                        className="fas fa-edit"
                                        onClick={() => handleEdit(job._id)}
                                        style={{ cursor: 'pointer', color: '#007bff' }}
                                    ></i>
                                    <i
                                        className="fas fa-trash"
                                        onClick={() => handleDelete(job._id)}
                                        style={{ cursor: 'pointer', color: '#dc3545' }}
                                    ></i>
                                    <button
                                        className="job-applications-btn"
                                        onClick={() => navigate(`/JobApplications/${job._id}`)}
                                    >
                                        Applications for Job
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {detoken && (detoken?.isJobPoster || detoken?.isAdmin) && (
                <button className="plus-button" onClick={addJob}>+</button>
            )}

            <Pagination
                currentPage={currentPage}
                totalItems={filteredJobs.length}
                itemsPerPage={jobsPerPage}
                onPageChange={paginate}
            />
        </div>
    );
}
