import { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

import './Form/form.css';
import Joi from "joi";
export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const { snackbar, setIsLoader, setUser, setToken, setDetoken } = useContext(MyContext);
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    function cleanForm() {
        setForm({
            email: '',
            password: '',
        });
    }
    const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            "string.email": "אימייל לא תקין",
            "string.empty": "יש להזין אימייל",
        }),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-]).{9,}$/)
            .required()
            .messages({
                "string.empty": "יש להזין סיסמה",
                "string.pattern.base":
                    "הסיסמה צריכה להיות לפחות 9 תווים, עם אות גדולה, אות קטנה, מספר ותו מיוחד (!@#$%^&*-)",
            }),
    });
    useEffect(() => {
        const { error } = schema.validate(form, { abortEarly: false });
        if (error) {
            const newErrors = {};
            error.details.forEach(err => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            setIsValid(false);
        } else {
            setErrors({});
            setIsValid(true);
        }
    }, [form]);
    const login = async ev => {
        ev.preventDefault();
        if (!isValid) return;
        setIsLoader(true);

        try {
            const res = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const err = await res.text();
                snackbar(err, "error");
                setIsLoader(false);
                return;
            }

            const result = await res.json();

            localStorage.setItem('token', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);

            const decoded = jwtDecode(result.token);

            setDetoken({
                _id: decoded._id,
                isJobSeeker: decoded.isJobSeeker,
                isJobPoster: decoded.isJobPoster,
                isAdmin: decoded.isAdmin,
            });
            setToken(result.token);
            const user = await fetch(`http://localhost:3000/users/${decoded._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': result.token,
                    'Content-Type': 'application/json'
                }
            });
            if (!user.ok) {
                const err = await user.text();
                snackbar(err, "error");
                setIsLoader(false);
                return;
            }
            else {
                const users = await user.json();
                setUser(users);
            }

            snackbar(`התחברת בהצלחה!`, "success");

            cleanForm();
            navigate('/');

        } catch (error) {
            snackbar('אירעה שגיאה בשרת, נסה שוב מאוחר יותר.', "error");
            console.error(error);
        }

        setIsLoader(false);
    };


    return (
        <>
            <form className="Form">
                <h2 className="mb-4 text-center">התחבר</h2>
                <div className="row">
                    <div className="col-12">
                        <label className="form-label">
                            מייל משתמש:
                            <input type="text" value={form.email} className="form-control" onChange={ev => setForm({ ...form, email: ev.target.value })} />
                            {errors.email && (<span>
                                {errors.email}
                            </span>)}
                        </label>
                    </div>
                    <div className="col-12">
                        <label className="form-label">
                            סיסמה:
                            <input type="password" value={form.password} className="form-control" onChange={ev => setForm({ ...form, password: ev.target.value })} />
                            {errors.password && (<span>
                                {errors.password}
                            </span>)}
                        </label>
                    </div>
                    <div className="col-12 text-center">
                        <button onClick={login} disabled={!isValid} style={{
                            cursor: isValid ? 'pointer' : 'not-allowed',
                        }}>התחבר</button>
                    </div>
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-primary" onClick={() => { cleanForm(); navigate('/') }}>Cancel</button>
                    </div>
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-primary" onClick={cleanForm}> <i className="fas fa-recycle me-2"></i></button>
                    </div>
                </div>
            </form>
        </>
    )
}
