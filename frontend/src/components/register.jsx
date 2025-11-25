import { useContext } from "react";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";
import './Form/form.css';
import UserFormFields from './Form/FormFieldUser';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
    const schema = yup.object({
        firstName: yup.string().min(2).required(),
        middleName: yup.string().min(2).max(256).notRequired().transform((v) => v || undefined),
        lastName: yup.string().min(2).required(),
        phone: yup.string().matches(/^0\d{8,9}$/, "Phone must be a valid Israeli number").required(),
        email: yup.string().email().required(),
        password: yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-]).{9,}$/,
            "Password must be 9+ chars with upper, lower, number, and special char").required(),
        imgUrl: yup.string().url().notRequired().transform(v => v || undefined),
        imgAlt: yup.string().min(2).max(256).notRequired().transform(v => v || undefined),
        state: yup.string().notRequired().transform(v => v || undefined),
        country: yup.string().required(),
        city: yup.string().required(),
        street: yup.string().required(),
        houseNumber: yup.number().min(1).required(),
        zip: yup.number().min(1).required(),
        industry: yup.string().required(),
        isJobSeeker: yup.boolean().required(),
    });

    const { register, handleSubmit, reset, formState: { errors, isValid }, watch } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            firstName: "", middleName: "", lastName: "",
            phone: "", email: "", password: "",
            imgUrl: "", imgAlt: "", state: "", country: "",
            city: "", street: "", houseNumber: undefined,
            zip: undefined,
            industry: "", isJobSeeker: true,
        }
    });

    // Debug
    console.log("Errors:", errors);
    console.log("isValid:", isValid);
    console.log("Form values:", watch());

    const navigate = useNavigate();
    const { snackbar, setIsLoader } = useContext(MyContext);

    const onSubmit = async (data) => {
        setIsLoader(true);
        const requestBody = {
            name: { first: data.firstName, middle: data.middleName, last: data.lastName },
            phone: data.phone,
            email: data.email,
            password: data.password,
            image: { url: data.imgUrl, alt: data.imgAlt },
            address: {
                state: data.state, country: data.country, city: data.city,
                street: data.street, houseNumber: data.houseNumber, zip: data.zip
            },
            isJobSeeker: data.isJobSeeker,
            industry: data.industry
        };

        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (res.ok) {
            reset();
            snackbar("נרשמת בהצלחה!", "success");
            navigate('/login');
        } else {
            const err = await res.text();
            snackbar(`הרשמה נכשלה: ${err}`, "error");
        }
        setIsLoader(false);
    };

    return (
        <div className="ContainForm">
            <form className="Form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="mb-4 text-center">טופס הרשמה</h2>
                <UserFormFields register={register} errors={errors} includeEmailAndPassword={true} />
                <div className="col-12 text-center mt-3">
                    <button type="submit" className="btn btn-primary" disabled={!isValid}>שלח</button>
                </div>
                <div className="row mt-3">
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-secondary" onClick={() => { reset(); navigate('/') }}>ביטול</button>
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
