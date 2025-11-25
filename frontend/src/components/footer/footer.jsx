import { MyContext } from "../../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faCircleInfo,
    faUserCircle,
    faBriefcase,
    faClipboardList,
    faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import './footer.css';

export default function Footer() {
    const { detoken } = useContext(MyContext);
    const path = useLocation().pathname;

    return (
        <footer>
            <ul className="footerUl">

                {/* About */}
                <li className={`IconsDiv ${path === '/about' ? 'active' : ''}`}>
                    <Link to="/about">
                        <FontAwesomeIcon icon={faCircleInfo} />
                        <span>About</span>
                    </Link>
                </li>

                {/* Favorites (only if logged in) */}
                {detoken && (
                    <li className={`IconsDiv ${path === '/FavJobs' ? 'active' : ''}`}>
                        <Link to="/FavJobs">
                            <FontAwesomeIcon icon={faHeart} />
                            <span>Favorites</span>
                        </Link>
                    </li>
                )}

                {/* Job Seeker → Applications */}
                {detoken?.isJobSeeker && (
                    <li className={`IconsDiv ${path === '/MyApplications' ? 'active' : ''}`}>
                        <Link to="/MyApplications">
                            <FontAwesomeIcon icon={faClipboardList} />
                            <span>My Applications</span>
                        </Link>
                    </li>
                )}

                {/* Job Poster → My Jobs */}
                {detoken?.isJobPoster && (
                    <li className={`IconsDiv ${path === '/MyJobs' ? 'active' : ''}`}>
                        <Link to="/MyJobs">
                            <FontAwesomeIcon icon={faBriefcase} />
                            <span>My Jobs</span>
                        </Link>
                    </li>
                )}

                {/* Admin panel */}
                {detoken?.isAdmin && (
                    <li className={`IconsDiv ${path === '/admin' ? 'active' : ''}`}>
                        <Link to="/admin">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            <span>Admin</span>
                        </Link>
                    </li>
                )}

            </ul>
        </footer>
    );
}

