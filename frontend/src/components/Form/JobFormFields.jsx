import React from "react";

export default function JobFormFields({ form, handleChange, errors }) {
    return (
        <>
            <div className="col-md-6 mb-3">
                <label>כותרת משרה:</label>
                <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} />
                {errors.title && <span>{errors.title}</span>}
            </div>

            <div className="col-md-6 mb-3">
                <label>שם החברה:</label>
                <input type="text" name="companyName" className="form-control" value={form.companyName} onChange={handleChange} />
                {errors.companyName && <span>{errors.companyName}</span>}
            </div>

            <div className="col-md-6 mb-3">
                <label>תחום:</label>
                <input type="text" name="industry" className="form-control" value={form.industry} onChange={handleChange} />
                {errors.industry && <span>{errors.industry}</span>}
            </div>

            <div className="col-md-6 mb-3">
                <label>סוג העסקה:</label>
                <select name="employmentType" className="form-select" value={form.employmentType} onChange={handleChange}>
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Temporary</option>
                    <option>Freelance</option>
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label>רמת ניסיון:</label>
                <select name="experienceLevel" className="form-select" value={form.experienceLevel} onChange={handleChange}>
                    <option>Entry</option>
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                    <option>Lead</option>
                </select>
            </div>

            <div className="col-md-3 mb-3">
                <label>שכר מינימום:</label>
                <input type="number" name="salaryMin" className="form-control" value={form.salaryMin} onChange={handleChange} />
                {errors.salaryMin && <span>{errors.salaryMin}</span>}
            </div>

            <div className="col-md-3 mb-3">
                <label>שכר מקסימום:</label>
                <input type="number" name="salaryMax" className="form-control" value={form.salaryMax} onChange={handleChange} />
                {errors.salaryMax && <span>{errors.salaryMax}</span>}
            </div>

            <div className="col-md-3 mb-3">
                <label>מטבע:</label>
                <input type="text" name="salaryCurrency" className="form-control" value={form.salaryCurrency} onChange={handleChange} />
            </div>

            <div className="col-12 mb-3">
                <label>תיאור המשרה:</label>
                <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange}></textarea>
                {errors.description && <span>{errors.description}</span>}
            </div>

            <div className="col-12 mb-3">
                <label>דרישות (מופרדות בפסיקים):</label>
                <input type="text" name="requirements" className="form-control" value={form.requirements} onChange={handleChange} />
            </div>

            <div className="col-12 mb-3">
                <label>הטבות (מופרדות בפסיקים):</label>
                <input type="text" name="benefits" className="form-control" value={form.benefits} onChange={handleChange} />
            </div>

            <div className="col-12 mb-3">
                <label>מרחוק:</label>
                <input type="checkbox" name="remote" checked={form.remote} onChange={handleChange} />
            </div>

            <div className="col-md-4 mb-3">
                <label>מדינה:</label>
                <input type="text" name="country" className="form-control" value={form.country} onChange={handleChange} />
                {errors.country && <span>{errors.country}</span>}
            </div>

            <div className="col-md-4 mb-3">
                <label>עיר:</label>
                <input type="text" name="city" className="form-control" value={form.city} onChange={handleChange} />
                {errors.city && <span>{errors.city}</span>}
            </div>

            <div className="col-md-4 mb-3">
                <label>רחוב:</label>
                <input type="text" name="street" className="form-control" value={form.street} onChange={handleChange} />
                {errors.street && <span>{errors.street}</span>}
            </div>

            <div className="col-md-6 mb-3">
                <label>מספר בית:</label>
                <input type="number" name="houseNumber" className="form-control" value={form.houseNumber} onChange={handleChange} />
                {errors.houseNumber && <span>{errors.houseNumber}</span>}
            </div>

            <div className="col-md-6 mb-3">
                <label>מיקוד:</label>
                <input type="number" name="zip" className="form-control" value={form.zip} onChange={handleChange} />
                {errors.zip && <span>{errors.zip}</span>}
            </div>

            <div className="col-12 mb-3">
                <label>מחוז/מדינה:</label>
                <input type="text" name="state" className="form-control" value={form.state} onChange={handleChange} />
            </div>
        </>
    );
}
