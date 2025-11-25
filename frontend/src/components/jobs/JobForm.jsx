import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useJobForm } from "./useJobForm"; // similar to useCardForm but for jobs
import JobFormFields from "../Form/JobFormFields"; // input fields matching JobSchema

export default function JobForm() {
    const { jobId } = useParams();
    const { snackbar, setIsLoader, token } = useContext(MyContext);
    const navigate = useNavigate();

    const { form, setForm, handleChange, resetForm, isValid, errors } = useJobForm();

    const isEdit = !!jobId;

    const fetchJob = async () => {
        setIsLoader(true);
        try {
            const res = await fetch(`http://localhost:3000/jobs/${jobId}`, {
                headers: { Authorization: token }
            });
            if (!res.ok) throw new Error("Failed to load job");
            const job = await res.json();
            setForm({
                title: job.title || "",
                companyName: job.companyName || "",
                industry: job.industry || "",
                employmentType: job.employmentType || "Full-Time",
                experienceLevel: job.experienceLevel || "Entry",
                salaryMin: job.salaryRange?.min || "",
                salaryMax: job.salaryRange?.max || "",
                salaryCurrency: job.salaryRange?.currency || "ILS",
                description: job.description || "",
                requirements: job.requirements?.join(", ") || "",
                benefits: job.benefits?.join(", ") || "",
                remote: job.remote || false,
                state: job.address?.state || "",
                country: job.address?.country || "",
                city: job.address?.city || "",
                street: job.address?.street || "",
                houseNumber: job.address?.houseNumber || "",
                zip: job.address?.zip || 0,
            });
        } catch (err) {
            snackbar("Error loading job", "error");
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        if (isEdit) fetchJob();
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;

        const method = isEdit ? "PUT" : "POST";
        const url = isEdit
            ? `http://localhost:3000/jobs/${jobId}`
            : `http://localhost:3000/jobs`;

        // Convert empty string numbers to null
        const parseNumber = (val) => (val === "" ? undefined : Number(val));

        const requestBody = {
            title: form.title,
            companyName: form.companyName,
            industry: form.industry,
            employmentType: form.employmentType,
            experienceLevel: form.experienceLevel,
            salaryRange: {
                min: parseNumber(form.salaryMin),
                max: parseNumber(form.salaryMax),
                currency: form.salaryCurrency
            },
            description: form.description,
            requirements: form.requirements.split(",").map(s => s.trim()).filter(Boolean),
            benefits: form.benefits.split(",").map(s => s.trim()).filter(Boolean),
            remote: form.remote,
            address: {
                state: form.state || "",
                country: form.country || "",
                city: form.city || "",
                street: form.street || "",
                houseNumber: parseNumber(form.houseNumber),
                zip: parseNumber(form.zip) || 0
            }

        };

        setIsLoader(true);
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (res.ok) {
                snackbar(isEdit ? "Job updated" : "New job posted", "success");
                resetForm();
                navigate("/myJobs");
            } else {
                const err = await res.text();
                snackbar(`Submission failed: ${err || "Unknown error"}`, "error");
            }
        } catch (err) {
            snackbar(`Submission failed: ${err.message}`, "error");
        } finally {
            setIsLoader(false);
        }
    };


    return (
        <div className="ContainForm">
            <form onSubmit={handleSubmit} className="Form row">
                <h2 className="text-center mb-4">{isEdit ? "Edit Job" : "Post New Job"}</h2>
                <JobFormFields form={form} handleChange={handleChange} errors={errors} />
                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary" disabled={!isValid}>Submit</button>
                </div>
                <div className="col-6 text-center">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/myJobs")}>Cancel</button>
                </div>
                <div className="col-6 text-center">
                    <button type="button" className="btn btn-warning" onClick={resetForm}>
                        <i className="fas fa-recycle me-2"></i> Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
