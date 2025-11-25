import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import { MyContext } from "../../App";
import CardDisplay from './Displays/card';
import TableDisplay from './Displays/table';
import "./css/job.css";
import "./css/jobHeader.css";
import "./css/display.css";

export default function GetFavJobs() {
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
    const { snackbar, setIsLoader, token, detoken, viewMode, search } = useContext(MyContext);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getJobs = async () => {
        if (!token) return;
        setIsLoader(true);
        const params = new URLSearchParams();
        if (search) params.append("q", search);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        try {
            const res = await fetch(`http://localhost:3000/jobs/search?${params.toString()}`, {
                headers: { 'Authorization': token },
            });
            if (!res.ok) throw new Error("שגיאה בקבלת המשרות");

            const data = await res.json();

            // Filter only favorites
            const favorites = data.filter(job =>
                job.likes?.some(userId => userId.toString() === detoken._id)
            );

            const updated = favorites.map(job => ({
                ...job,
                favorite: true
            }));

            setJobs(updated);
        } catch (err) {
            snackbar(err.message, "error");
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        getJobs();
    }, [token]);

    useEffect(() => {
        if (search) setCurrentPage(1);
    }, [search]);

    const handleClick = (id) => navigate(`/job/${id}`);

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

    // Filtering logic
    function filterJobs(job) {
        if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && !job.description.toLowerCase().includes(search.toLowerCase()))
            return false;
        if (filters.industry && !job.industry.toLowerCase().includes(filters.industry.toLowerCase())) return false;
        if (filters.city && !job.address?.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false;
        if (filters.employmentType && job.employmentType !== filters.employmentType) return false;
        if (filters.minSalary && job.salaryRange?.min < filters.minSalary) return false;
        if (filters.maxSalary && job.salaryRange?.max > filters.maxSalary) return false;
        return true;
    }

    const filteredJobs = jobs.filter(filterJobs);
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    return (
        <div className="Jobs">
            <div className="JobsHeader">
                <h1>Your Favorite Jobs</h1>
                <p>Here you can find all your favorite jobs.</p>
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

            <div className="JobsContainer">
                {viewMode === "card" ? (
                    <CardDisplay currentJobs={currentJobs} detoken={detoken} handleClick={handleClick} handleFavorite={handleFavorite} />
                ) : (
                    <TableDisplay currentJobs={currentJobs} detoken={detoken} handleClick={handleClick} handleFavorite={handleFavorite} />
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={filteredJobs.length}
                itemsPerPage={jobsPerPage}
                onPageChange={paginate}
            />
        </div>
    );
}
