import React from "react";
import './about.css';

export default function AboutPage() {
    return (
        <div className="container about py-5">
            <h1 className="display-4 text-center mb-4">על האתר</h1>

            <p className="lead text-center mb-5">
                מערכת חכמה ודינמית לחיפוש משרות, הגשת מועמדות וניהול תהליכי גיוס — הכול במקום אחד.
                הפלטפורמה מאפשרת למועמדים ולמעסיקים לעבוד בצורה נוחה, יעילה ומאובטחת, עם חוויית משתמש מודרנית
                ומותאמת אישית.
            </p>

            <div className="row g-4">

                <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">מה מטרת האתר?</h5>
                            <p className="card-text">
                                המערכת נועדה לחבר בין מחפשי עבודה לבין חברות ומעסיקים.
                                ניתן לראות משרות, להגיש מועמדות, להעלות קורות חיים, לעקוב אחר סטטוס הבקשות –
                                ובמקביל למעסיקים יש כלים לנהל מועמדים, לצפות בקבצים, לסמן סטטוסים ולעקוב אחר פניות.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">למי האתר מיועד?</h5>
                            <p className="card-text">
                                האתר מתאים לשני סוגי משתמשים:
                                <br />• <strong>מחפשי עבודה</strong> — יכולים לחפש משרות, לסנן, לשמור מועדפים ולהגיש מועמדות בקלות.
                                <br />• <strong>מעסיקים</strong> — יכולים לפרסם משרות, לנהל מועמדים, לעדכן סטטוס ולראות קורות חיים שהוגשו.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">טכנולוגיות בשימוש</h5>
                            <p className="card-text">
                                האתר נבנה באמצעות React בצד לקוח, Node.js ו-Express בצד שרת,
                                מסד נתונים MongoDB, ניהול אימות והרשאות בעזרת JWT,
                                העלאת קבצים עם Multer, ועיצוב בעזרת Bootstrap.
                                כל המערכת רספונסיבית ומהירה לשימוש בכל מכשיר.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">יכולות המערכת</h5>
                            <p className="card-text">
                                • הגשת מועמדות למשרות עם קובץ קורות חיים
                                <br />• צפייה, חיפוש וסינון משרות לפי קטגוריות
                                <br />• שמירת משרות כמועדפות
                                <br />• מעקב אחרי סטטוס המועמדות
                                <br />• מערכת ניהול מתקדמת למעסיקים
                                <br />• מחיקה וניהול מאובטח של קבצים
                                <br />• רענון טוקנים אוטומטי וניהול הרשאות חכם
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="text-center mt-5">
                <p className="text-muted aboutLast">
                    הפרויקט פותח כחלק מפרויקט מסכם בקורס React ו-Node.js,
                    ומציג יכולות עבודה מלאות במערכת מבוססת Client-Server, כולל ניהול משתמשים,
                    הרשאות, העלאות קבצים ועבודה מול מסד נתונים.
                </p>
            </div>
        </div>
    );
}
