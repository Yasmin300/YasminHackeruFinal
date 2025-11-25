import { useContext, useEffect } from "react";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";
import './Form/form.css';
import UserFormFields from './Form/FormFieldUser';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle } from '@fortawesome/free-solid-svg-icons';

export default function EditProfile() {
    const { snackbar, setIsLoader, user, setUser, token, detoken } = useContext(MyContext);
    const navigate = useNavigate();

    // ✅ Yup validation schema (same style as Register)
    const schema = yup.object({
        firstName: yup.string().min(2).required("יש להזין שם פרטי"),
        middleName: yup.string().min(2).max(256).notRequired().transform((v) => v || undefined),
        lastName: yup.string().min(2).required("יש להזין שם משפחה"),
        phone: yup.string().matches(/^0\d{8,9}$/, "טלפון ישראלי תקין").required(),
        imgUrl: yup.string().url("קישור לתמונה לא תקין").notRequired().transform(v => v || undefined),
        imgAlt: yup.string().min(2).max(256).notRequired().transform(v => v || undefined),
        state: yup.string().notRequired().transform(v => v || undefined),
        country: yup.string().required("יש להזין מדינה"),
        city: yup.string().required("יש להזין עיר"),
        street: yup.string().required("יש להזין רחוב"),
        houseNumber: yup.number().min(1, "מספר חייב להיות גדול מ-0").required(),
        zip: yup.number().min(1, "מיקוד חייב להיות גדול מ-0").required(),
        industry: yup.string().required("יש להזין תחום תעשייה"),
        isJobSeeker: yup.boolean().required(),
    });

    // ✅ React Hook Form setup
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            firstName: "", middleName: "", lastName: "",
            phone: "", imgUrl: "", imgAlt: "",
            state: "", country: "", city: "", street: "",
            houseNumber: undefined, zip: undefined,
            industry: "", isJobSeeker: true,
        }
    });

    // ✅ Pre-fill user data once loaded
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.name?.first || "",
                middleName: user.name?.middle || "",
                lastName: user.name?.last || "",
                phone: user.phone || "",
                imgUrl: user.image?.url || "",
                imgAlt: user.image?.alt || "",
                state: user.address?.state || "",
                country: user.address?.country || "",
                city: user.address?.city || "",
                street: user.address?.street || "",
                houseNumber: user.address?.houseNumber || "",
                zip: user.address?.zip || "",
                industry: user.industry || "",
                isJobSeeker: user.isJobSeeker ?? true,
            });
        }
    }, [user, reset]);

    // ✅ Handle form submit
    const onSubmit = async (data) => {
        setIsLoader(true);
        const requestBody = {
            name: { first: data.firstName, middle: data.middleName, last: data.lastName },
            phone: data.phone,
            image: { url: data.imgUrl, alt: data.imgAlt },
            address: {
                state: data.state, country: data.country, city: data.city,
                street: data.street, houseNumber: Number(data.houseNumber), zip: Number(data.zip)
            },
            industry: data.industry,
            isJobSeeker: data.isJobSeeker
        };

        try {
            const res = await fetch(`http://localhost:3000/users/${detoken._id}`, {
                method: "PUT",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!res.ok) throw new Error("עדכון הפרופיל נכשל");

            const updatedUser = await res.json();
            setUser(updatedUser);
            snackbar("הפרופיל עודכן בהצלחה!", "success");
            navigate("/");
        } catch (err) {
            snackbar(err.message || "שגיאה בעדכון הפרופיל", "error");
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <div className="ContainForm">
            <form className="Form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="mb-4 text-center">עריכת פרופיל</h2>

                {/* ✅ Reuse same field component */}
                <UserFormFields register={register} errors={errors} includeEmailAndPassword={false} />

                <div className="col-12 text-center mt-3">
                    <button type="submit" className="btn btn-primary" disabled={!isValid}>עדכן</button>
                </div>

                <div className="row mt-3">
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-secondary" onClick={() => { reset(); navigate('/'); }}>
                            ביטול
                        </button>
                    </div>
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-secondary" onClick={reset}>
                            <FontAwesomeIcon icon={faRecycle} className="me-2" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
