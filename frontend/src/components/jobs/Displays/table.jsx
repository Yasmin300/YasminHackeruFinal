import React from "react";

export default function TableDisplay({ currentJobs, detoken, handleClick, handleFavorite, handleDelete }) {
    return (
        <table className="JobTable">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Type</th>
                    <th>Level</th>
                    <th>Salary</th>
                    <th>City</th>
                    {detoken && <th>Favorite</th>}
                    {detoken?.isAdmin && <th>Delete</th>}
                </tr>
            </thead>
            <tbody>
                {currentJobs.map((job) => (
                    <tr key={job._id} onClick={() => handleClick(job._id)}>
                        <td data-label="Title">{job.title}</td>
                        <td data-label="Company">{job.companyName}</td>
                        <td data-label="Industry">{job.industry}</td>
                        <td data-label="Type">{job.employmentType}</td>
                        <td data-label="Level">{job.experienceLevel}</td>
                        <td data-label="Salary">
                            {job.salaryRange?.min} - {job.salaryRange?.max} {job.salaryRange?.currency}
                        </td>
                        <td data-label="City">{job.address?.city}</td>

                        {detoken && (
                            <td
                                data-label="Favorite"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <i
                                    className={`fas fa-heart ${job.favorite ? "fav" : ""}`}
                                    onClick={() => handleFavorite(job._id)}
                                ></i>
                            </td>
                        )}

                        {detoken?.isAdmin && (
                            <td
                                data-label="Delete"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <i
                                    className="fas fa-trash"
                                    style={{ color: "#dc3545", cursor: "pointer" }}
                                    onClick={() => handleDelete(job._id)}
                                ></i>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
