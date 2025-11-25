import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { MyContext } from "../../App";
import './nav.css';
import './dark_nav.css';
import './light_nav.css';

export default function Navbar() {
    const path = useLocation().pathname;
    const { user, detoken, setUser, setToken, setDetoken, darkMode, setDarkMode, search, setSearch, viewMode, setViewMode } = useContext(MyContext);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [validImg, setValidImg] = useState(false);
    const navbarRef = useRef();

    useEffect(() => {
        if (!user || !user.image?.url) return;
        const img = new Image();
        img.src = user.image.url;
        img.onload = () => setValidImg(true);
        img.onerror = () => setValidImg(false);
    }, [user]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const logout = () => {
        setUser(null);
        setToken(null);
        setDetoken(null);
        setSearch(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    const closeNavbar = () => {
        if (navbarRef.current?.classList.contains('show')) {
            new window.bootstrap.Collapse(navbarRef.current, { toggle: false }).hide();
        }
    };

    const handleSearch = () => {
        setSearch(searchInput);
        closeNavbar();
    };

    return (
        <nav className={`navbar navbar-expand-lg px-4 ${darkMode ? 'dark' : 'light'}`}>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar" ref={navbarRef}>
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`} onClick={closeNavbar}>Jobs</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className={`nav-link ${path === '/about' ? 'active' : ''}`} onClick={closeNavbar}>About</Link>
                    </li>
                    {detoken && (
                        <li className="nav-item">
                            <Link to="/FavJobs" className={`nav-link ${path === '/FavJobs' ? 'active' : ''}`} onClick={closeNavbar}>Favorites</Link>
                        </li>
                    )}
                    {detoken?.isJobSeeker && (
                        <li className="nav-item">
                            <Link to="/MyApplications" className={`nav-link ${path === '/MyApplications' ? 'active' : ''}`} onClick={closeNavbar}>My applications</Link>
                        </li>
                    )}
                    {detoken?.isJobPoster && (
                        <li className="nav-item">
                            <Link to="/MyJobs" className={`nav-link ${path === '/MyJobs' ? 'active' : ''}`} onClick={closeNavbar}>My Jobs</Link>
                        </li>
                    )}

                    {detoken?.isAdmin && (
                        <li className="nav-item">
                            <Link to="/admin" className={`nav-link ${path === '/admin' ? 'active' : ''}`} onClick={closeNavbar}>Admin</Link>
                        </li>
                    )}
                </ul>

                <ul className="navbar-nav ms-auto align-items-center">
                    <li className="nav-item d-flex align-items-center searchCon">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            onClick={handleSearch}
                            className="searchIcon me-2"
                        />
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search jobs"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                        />
                    </li>

                    <li className="nav-item">
                        <button onClick={toggleDarkMode} className="btn btn-link nav-link toggle">
                            {darkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
                        </button>
                    </li>
                    <li className="nav-item">
                        <div className="view-toggle">
                            <button
                                className={viewMode === "card" ? "active" : ""}
                                onClick={() => setViewMode("card")}
                            >
                                🧩 Card View
                            </button>
                            <button
                                className={viewMode === "table" ? "active" : ""}
                                onClick={() => setViewMode("table")}
                            >
                                📋 Table View
                            </button>
                        </div>
                    </li>
                    {!detoken ? (
                        <>
                            <li className="nav-item">
                                <Link to="/register" className={`nav-link ${path === '/register' ? 'active' : ''}`}>Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className={`nav-link ${path === '/login' ? 'active' : ''}`} >Login</Link>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item user-menu">
                            {validImg ? (
                                <img src={user?.image.url} alt="user" className="imgAccount" />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="secPart" />
                            )}
                            <div className="dropdown">
                                <button className="dropdown-item" onClick={() => { navigate('/profile'); closeNavbar(); }}>
                                    Edit Profile
                                </button>
                                <button className="dropdown-item" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
