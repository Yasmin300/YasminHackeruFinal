import React from "react";

export default function UserFormFields({ register, errors, includeEmailAndPassword = false }) {
    return (
        <>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">שם פרטי:</label>
                    <input type="text" {...register("firstName")} className="form-control" />
                    <span className="text-danger">{errors.firstName?.message}</span>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">שם אמצעי:</label>
                    <input type="text" {...register("middleName")} className="form-control" />
                    <span className="text-danger">{errors.middleName?.message}</span>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">שם משפחה:</label>
                    <input type="text" {...register("lastName")} className="form-control" />
                    <span className="text-danger">{errors.lastName?.message}</span>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">טלפון:</label>
                    <input type="text" {...register("phone")} className="form-control" />
                    <span className="text-danger">{errors.phone?.message}</span>
                </div>

                {includeEmailAndPassword && (
                    <>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">דוא"ל:</label>
                            <input type="text" {...register("email")} className="form-control" />
                            <span className="text-danger">{errors.email?.message}</span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">סיסמה:</label>
                            <input type="password" {...register("password")} className="form-control" />
                            <span className="text-danger">{errors.password?.message}</span>
                        </div>
                    </>
                )}

                <div className="col-12 mb-3">
                    <label className="form-label">כתובת תמונה:</label>
                    <input type="text" {...register("imgUrl")} className="form-control" />
                    <span className="text-danger">{errors.imgUrl?.message}</span>
                </div>
                <div className="col-12 mb-3">
                    <label className="form-label">תיאור תמונה:</label>
                    <input type="text" {...register("imgAlt")} className="form-control" />
                    <span className="text-danger">{errors.imgAlt?.message}</span>
                </div>

                <div className="col-md-4 mb-3">
                    <label className="form-label">מדינה:</label>
                    <input type="text" {...register("country")} className="form-control" />
                    <span className="text-danger">{errors.country?.message}</span>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">עיר:</label>
                    <input type="text" {...register("city")} className="form-control" />
                    <span className="text-danger">{errors.city?.message}</span>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">רחוב:</label>
                    <input type="text" {...register("street")} className="form-control" />
                    <span className="text-danger">{errors.street?.message}</span>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">מספר בית:</label>
                    <input type="number" {...register("houseNumber", { valueAsNumber: true })} className="form-control" />
                    <span className="text-danger">{errors.houseNumber?.message}</span>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">מיקוד:</label>
                    <input type="number" {...register("zip", { valueAsNumber: true })} className="form-control" />
                    <span className="text-danger">{errors.zip?.message}</span>
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">מחוז/מדינה:</label>
                    <input type="text" {...register("state")} className="form-control" />
                    <span className="text-danger">{errors.state?.message}</span>
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">בחר סוג משתמש:</label>
                    <select {...register("isJobSeeker")} defaultValue={true} className="form-control">
                        <option value={true}>JobSeeker</option>
                        <option value={false}>JobPoster</option>
                    </select>
                    <span className="text-danger">{errors.isJobSeeker?.message}</span>
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">Industry</label>
                    <input type="text" {...register("industry")} className="form-control" />
                    <span className="text-danger">{errors.industry?.message}</span>
                </div>
            </div>
        </>
    );
}
