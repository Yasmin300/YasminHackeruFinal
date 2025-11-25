import React from "react";

export default function CardDisplay({ currentJobs, detoken, handleClick, handleFavorite, handleDelete }) {
    return (
        <>
            {currentJobs.map((job) => (
                <div key={job._id} id={job._id} onClick={() => handleClick(job._id)}>
                    <li className="JobList">
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.companyName}</p>
                        <p><strong>Industry:</strong> {job.industry}</p>
                        <p><strong>Type:</strong> {job.employmentType} | <strong>Level:</strong> {job.experienceLevel}</p>
                        <p><strong>Salary:</strong> {job.salaryRange?.min} - {job.salaryRange?.max} {job.salaryRange?.currency}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                        <p><strong>Address:</strong> {job.address?.street} {job.address?.houseNumber}, {job.address?.city}, {job.address?.state}, {job.address?.zip}, {job.address?.country}</p>
                        <a href={`tel:${job.phone}`} onClick={(e) => e.stopPropagation()}> <i className="fas fa-phone"></i> </a>
                        {
                            detoken && (
                                <i className={`fas fa-heart ${job.favorite ? 'fav' : ''}`} onClick={(e) => { e.stopPropagation(); handleFavorite(job._id); }} style={{ cursor: 'pointer', marginLeft: '10px' }} ></i>
                            )
                        }
                        {detoken?.isAdmin && (
                            <i className="fas fa-trash" onClick={() => handleDelete(job._id)} style={{ cursor: 'pointer', color: '#dc3545' }}></i>
                        )}
                    </li>
                </div>
            ))}
        </>
    );
}
