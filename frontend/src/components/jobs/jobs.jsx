import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import { MyContext } from "../../App";
import "./css/job.css";
import "./css/jobHeader.css";
import "./css/display.css";
import CardDisplay from './Displays/card';
import TableDisplay from './Displays/table';
export default function GetJobs() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 15;
    const [filters, setFilters] = useState({
        industry: "",
        city: "",
        experienceLevel: "",
        employmentType: "",
        minSalary: "",
        maxSalary: ""
    });
    const { snackbar, setIsLoader, user, search, token, detoken, viewMode } = useContext(MyContext);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getJobs = async () => {
        setIsLoader(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("q", search);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const res = await fetch(`http://localhost:3000/jobs/search?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                const updated = data.map(job => ({
                    ...job,
                    favorite: user && job.likes.includes(detoken?._id)
                }));
                setJobs(updated);
            } else snackbar("Failed to load jobs", "error");
        } catch {
            snackbar("Error loading jobs", "error");
        } finally {
            setIsLoader(false);
        }
    };

    const handleClick = (id) => {
        navigate(`/job/${id}`);
    };

    const handleFavorite = async (id) => {
        const res = await fetch(`http://localhost:3000/jobs/${id}`, {
            headers: {
                'Authorization': token,
            },
            method: 'PATCH',
        });
        if (res.ok) {
            getJobs();
            snackbar("Added/removed job from favorites", "success");
        } else {
            snackbar("Action failed", "error");
        }
    };

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
        if (search) setCurrentPage(1);
    }, [search]);

    function filterJobs(job, search) {
        if (search)
            return job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase());
        return true;
    }
    useEffect(() => {
        getJobs();
    }, [search, filters]);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const clearFilters = () => setFilters({
        industry: "",
        city: "",
        experienceLevel: "",
        employmentType: "",
        minSalary: "",
        maxSalary: ""
    });

    return (
        <div className="Jobs">
            <div className="JobsHeader">
                <h1>Welcome to the Job Board</h1>
                <p>Explore new career opportunities from top companies, all in one place.</p>
                <p><strong>Want to save your favorite jobs?</strong> Create a free account and start tracking your dream positions!</p>

                {
                    !user &&
                    <div className="registerPrompt">
                        <p>⭐ <strong>Register now</strong> to access features like:</p>
                        <ul>
                            <li>❤️ Save and favorite jobs</li>
                            <li>📋 Keep track of job opportunities</li>
                            <li>🔒 Personalized experience</li>
                        </ul>
                        <button onClick={() => navigate('/register')} className="registerButton">
                            Create Free Account
                        </button>
                    </div>
                }
                <hr />
            </div>

            <div className="filter-container">
                <input type="text" name="industry" placeholder="Industry" value={filters.industry} onChange={handleFilterChange} />
                <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} />
                <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}>
                    <option value="">Experience Level</option>
                    <option value="Entry">Entry</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                </select>
                <select name="employmentType" value={filters.employmentType} onChange={handleFilterChange}>
                    <option value="">Employment Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Temporary">Temporary</option>
                </select>
                <input type="number" name="minSalary" placeholder="Min Salary" value={filters.minSalary} onChange={handleFilterChange} />
                <input type="number" name="maxSalary" placeholder="Max Salary" value={filters.maxSalary} onChange={handleFilterChange} />
                <button onClick={clearFilters}>Clear</button>
            </div>
            {/* 🔹 Job Display */}
            <div className="JobsContainer">
                {viewMode === "card" ? (
                    <CardDisplay currentJobs={currentJobs} detoken={detoken} handleClick={handleClick} handleFavorite={handleFavorite} handleDelete={handleDelete} />
                ) : (
                    <TableDisplay currentJobs={currentJobs} detoken={detoken} handleClick={handleClick} handleFavorite={handleFavorite} handleDelete={handleDelete} />
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={jobs.length}
                itemsPerPage={jobsPerPage}
                onPageChange={paginate}
            />
        </div>
    );
}
