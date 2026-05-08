import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Trash2, Edit, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown, UserPlus } from 'lucide-react';
import API from '../api';
import EditStudent from './EditStudent';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [department, setDepartment] = useState('All');
    const [departments, setDepartments] = useState(['All']);
    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('desc');
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await API.get('/students/stats');
                if (res.data && res.data.departments) {
                    setDepartments(['All', ...Object.keys(res.data.departments)]);
                }
            } catch (err) {
                console.error("Error fetching depts:", err);
            }
        };
        fetchDepts();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchStudents = useCallback(async () => {
        try {
            const res = await API.get('/students', {
                params: { 
                    page, 
                    size: 5, 
                    sortBy,
                    direction,
                    search: searchQuery || undefined, 
                    department: department !== 'All' ? department : undefined 
                }
            });
            setStudents(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error(err);
        }
    }, [page, searchQuery, department, sortBy, direction]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setDirection(direction === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setDirection('asc');
        }
        setPage(0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent delete this record?")) return;
        try {
            await API.delete(`/students/${id}`);
            fetchStudents();
        } catch (err) {
            alert("Error: Record could not be removed.");
        }
    };

    return (
        <div className="list-container">
            <div className="list-controls">
                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                
                <div className="filter-box">
                    <Filter size={18} />
                    <select 
                        value={department} 
                        onChange={(e) => { setDepartment(e.target.value); setPage(0); }}
                    >
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>
                                <div className="th-content">Student <ArrowUpDown size={14} /></div>
                            </th>
                            <th onClick={() => handleSort('rollNumber')}>
                                <div className="th-content">Roll No <ArrowUpDown size={14} /></div>
                            </th>
                            <th onClick={() => handleSort('department')}>
                                <div className="th-content">Dept <ArrowUpDown size={14} /></div>
                            </th>
                            <th>Contact</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s, idx) => (
                            <tr key={s.id} className={`animate-entrance delay-${(idx % 4) + 1}`}>
                                <td>
                                    <div className="user-cell">
                                        <div className="mini-avatar">{s.name?.[0]}</div>
                                        <span className="user-name-text">{s.name}</span>
                                    </div>
                                </td>
                                <td><span className="badge">{s.rollNumber}</span></td>
                                <td>
                                    <div className="dept-cell">
                                        <span className="dept-main">{s.department}</span>
                                        <span className="dept-sub">Year {s.year}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <span className="contact-email">{s.email}</span>
                                        <span className="contact-phone">{s.phone || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="action-cell">
                                        <button onClick={() => setEditingStudent(s)} className="action-btn edit" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="action-btn delete" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {students.length === 0 && (
                    <div className="empty-state">
                        <Search size={48} className="empty-icon" />
                        <p>No matching records found</p>
                    </div>
                )}
            </div>

            <div className="pagination-bar">
                <button 
                    disabled={page === 0} 
                    onClick={() => setPage(p => p - 1)} 
                    className="p-btn"
                >
                    <ChevronLeft size={18} /> Prev
                </button>
                
                <div className="p-numbers">
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setPage(i)}
                            className={`p-num-btn ${page === i ? 'active' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button 
                    disabled={page >= totalPages - 1} 
                    onClick={() => setPage(p => p + 1)} 
                    className="p-btn"
                >
                    Next <ChevronRight size={18} />
                </button>
            </div>

            {editingStudent && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-entrance">
                        <EditStudent 
                            student={editingStudent} 
                            onClose={() => setEditingStudent(null)} 
                            onSaved={() => { setEditingStudent(null); fetchStudents(); }} 
                        />
                    </div>
                </div>
            )}

            <style>{`
                .list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .list-controls {
                    display: flex;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                }

                .search-box {
                    flex: 1;
                    max-width: 400px;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-dim);
                }

                .search-box input {
                    width: 100%;
                    padding: 14px 14px 14px 48px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: 12px;
                    color: var(--text-main);
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s;
                }

                .search-box input:focus {
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.05);
                }

                .filter-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: 12px;
                    color: var(--text-dim);
                }

                .filter-box select {
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    font-size: 14px;
                    font-weight: 600;
                    outline: none;
                    cursor: pointer;
                    padding: 12px 0;
                }

                .custom-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 8px;
                }

                .custom-table th {
                    text-align: left;
                    padding: 12px 24px;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-dim);
                    font-weight: 800;
                }

                .th-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .custom-table tr {
                    background: rgba(255, 255, 255, 0.01);
                    transition: all 0.3s;
                }

                .custom-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.03);
                }

                .custom-table td {
                    padding: 16px 24px;
                    border-top: 1px solid var(--border-light);
                    border-bottom: 1px solid var(--border-light);
                }

                .custom-table td:first-child {
                    border-left: 1px solid var(--border-light);
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                }

                .custom-table td:last-child {
                    border-right: 1px solid var(--border-light);
                    border-top-right-radius: 12px;
                    border-bottom-right-radius: 12px;
                }

                .user-cell {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .mini-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                    font-size: 14px;
                }

                .user-name-text {
                    font-weight: 600;
                    font-size: 14px;
                }

                .badge {
                    padding: 4px 12px;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary);
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .dept-cell, .contact-cell {
                    display: flex;
                    flex-direction: column;
                }

                .dept-main, .contact-email {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .dept-sub, .contact-phone {
                    font-size: 11px;
                    color: var(--text-dim);
                }

                .action-cell {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }

                .action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border-glass);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .action-btn.edit:hover {
                    color: var(--primary);
                    background: rgba(59, 130, 246, 0.1);
                    border-color: var(--primary);
                }

                .action-btn.delete:hover {
                    color: var(--danger);
                    background: rgba(239, 68, 68, 0.1);
                    border-color: var(--danger);
                }

                .empty-state {
                    padding: 80px 0;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .empty-icon {
                    opacity: 0.1;
                    color: var(--text-dim);
                }

                .pagination-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                }

                .p-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: 8px;
                    color: var(--text-main);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .p-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .p-num-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    color: var(--text-dim);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .p-num-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: var(--text-main);
                }

                .p-num-btn.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }

                .p-numbers {
                    display: flex;
                    gap: 8px;
                }

                .highlight {
                    color: var(--primary);
                    font-weight: 800;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 24px;
                }

                .modal-content {
                    width: 100%;
                    max-width: 600px;
                    padding: 40px;
                }
            `}</style>
        </div>
    );
};

export default StudentList;