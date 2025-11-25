import { useState, useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from "../pagination/Pagination";
import './AdminProfile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function UserImage({ user }) {
    const [validImg, setValidImg] = useState(true);
    return user.image?.url && validImg ? (
        <img
            src={user.image.url}
            alt={user.image.alt}
            className="rounded-circle"
            width="60"
            height="60"
            onError={() => setValidImg(false)}
        />
    ) : (
        <FontAwesomeIcon icon={faUser} className="text-secondary" size="2x" />
    );
}

export default function AdminProfile() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const navigate = useNavigate();
    const { snackbar, setIsLoader, token, detoken } = useContext(MyContext);

    const getUsers = async () => {
        setIsLoader(true);
        const res = await fetch("http://localhost:3000/users", {
            headers: { "Authorization": token },
        });
        if (res.ok) {
            const data = await res.json();
            setUsers(data);
        }
        setIsLoader(false);
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        setIsLoader(true);
        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": token },
        });
        if (res.ok) {
            snackbar("User deleted successfully", "success");
            await getUsers();
        } else {
            snackbar("Failed to delete user", "error");
        }
        setIsLoader(false);
    };

    // ✅ NEW: Toggle Admin Status
    const toggleAdminStatus = async (id) => {
        const res = await fetch(`http://localhost:3000/users/${id}/admin`, {
            method: "PATCH",
            headers: { "Authorization": token },
        });
        if (res.ok) {
            const data = await res.json();
            snackbar(data.message, "success");
            await getUsers();
        } else {
            snackbar("Failed to change admin status", "error");
        }
    };

    useEffect(() => {
        if (!detoken?.isAdmin) navigate("/");
        getUsers();
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="TableUsers mt-5 container">
            <div className="text-center mb-4">
                <h1 className="fw-bold">Admin Dashboard</h1>
                <p className="text-muted">Manage users and their statuses</p>
            </div>
            <div className="table-responsive shadow rounded-4">
                <table className="table table-striped table-hover align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id}>
                                <td><UserImage user={user} /></td>
                                <td>{user.name.first} {user.name.middle} {user.name.last}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>
                                    {user.address.street} {user.address.houseNumber}, {user.address.city}, {user.address.country}
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <span className="badge bg-danger">Admin</span>
                                    ) : user.isBusiness ? (
                                        <span className="badge bg-info text-dark">Business</span>
                                    ) : (
                                        <span className="badge bg-secondary">Regular</span>
                                    )}
                                </td>
                                <td>
                                    {!user.isAdmin && (
                                        <>
                                            <button
                                                className="btn btn-danger btn-sm me-2"
                                                onClick={() => handleDeleteUser(user._id)}
                                                title="Delete User"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className={`btn ${user.isAdmin ? "btn-secondary" : "btn-primary"} btn-sm`}
                                        onClick={() => toggleAdminStatus(user._id)}
                                        title={user.isAdmin ? "Demote to Regular" : "Promote to Admin"}
                                    >
                                        <i className="fas fa-user-shield"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={users.length}
                itemsPerPage={usersPerPage}
                onPageChange={paginate}
            />
        </div>
    );
}
