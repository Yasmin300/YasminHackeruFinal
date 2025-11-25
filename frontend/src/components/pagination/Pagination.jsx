
import React from 'react';
export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getVisiblePages = () => {
        const maxPagesAround = window.innerWidth < 576 ? 1 : 2;
        const start = Math.max(currentPage - maxPagesAround, 2);
        const end = Math.min(currentPage + maxPagesAround, totalPages - 1);
        const visible = [];
        for (let i = start; i <= end; i++) {
            visible.push(i);
        }
        return visible;
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) return null; // No pagination needed

    return (
        <nav className="UserPag">
            <ul className="pagination justify-content-center flex-wrap">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(1)}>« First</button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>‹ Prev</button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(1)}>1</button>
                </li>
                {visiblePages[0] > 2 && (
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                )}
                {visiblePages.map(num => (
                    <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(num)}>{num}</button>
                    </li>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                )}
                <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Next ›</button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(totalPages)}>Last »</button>
                </li>
            </ul>
        </nav>
    );
}
