import React, { useState, useEffect } from 'react';
import { UserPlus, Save, Trash2, Edit, BookOpen, ShieldCheck, Mail, Hash, Layers, LayoutGrid } from 'lucide-react';
import API from '../api';

const AdminFacultyManager = () => {
    const [faculty, setFaculty] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ name: '', employeeId: '', email: '', department: 'Computer Science', designation: 'Professor' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFaculty();
        fetchCourses();
    }, []);

    const fetchFaculty = async () => {
        try {
            const res = await API.get('/faculty');
            setFaculty(res.data || []);
        } catch (err) {
            console.error("Fetch Faculty Error:", err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await API.get('/courses');
            setCourses(res.data || []);
        } catch (err) {
            console.error("Fetch Courses Error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (editingId) {
            const original = faculty.find(f => f.id === editingId);
            if (original && formData.employeeId !== original.employeeId) {
                if (!window.confirm("WARNING: Changing the Employee ID will change the faculty's login username. Continue?")) {
                    return;
                }
            }
        }

        setLoading(true);
        try {
            if (editingId) {
                await API.put(`/faculty/${editingId}`, formData);
            } else {
                await API.post('/faculty', formData);
            }
            alert("Faculty data synchronized successfully!");
            setFormData({ name: '', employeeId: '', email: '', department: 'Computer Science', designation: 'Professor' });
            setEditingId(null);
            fetchFaculty();
        } catch (err) {
            alert(err.response?.data || "Transaction failed. Please verify unique IDs.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (f) => {
        setEditingId(f.id);
        setFormData({ ...f });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent delete this record?")) return;
        try {
            await API.delete(`/faculty/${id}`);
            fetchFaculty();
        } catch (err) {
            alert("Delete error.");
        }
    };

    const assignFacultyToCourse = async (courseId, facultyId) => {
        if (!facultyId) return;
        try {
            await API.put(`/courses/${courseId}/assign-faculty/${facultyId}`);
            fetchCourses();
        } catch (err) {
            alert("Mapping error.");
        }
    };

    return (
        <div className="mgr-container">
            {/* Quick Stats Integration */}
            <div className="mgr-stats">
                <div className="mgr-stat-card glass-panel accent-primary">
                    <ShieldCheck className="mgr-stat-icon" />
                    <div className="mgr-stat-info">
                        <span className="mgr-stat-label">Total Faculty</span>
                        <h3 className="mgr-stat-value">{faculty.length}</h3>
                    </div>
                </div>
                <div className="mgr-stat-card glass-panel accent-success">
                    <BookOpen className="mgr-stat-icon" />
                    <div className="mgr-stat-info">
                        <span className="mgr-stat-label">Assigned Courses</span>
                        <h3 className="mgr-stat-value">{courses.filter(c => c.assignedFaculty).length}</h3>
                    </div>
                </div>
                <div className="mgr-stat-card glass-panel accent-purple">
                    <Layers className="mgr-stat-icon" />
                    <div className="mgr-stat-info">
                        <span className="mgr-stat-label">Available Units</span>
                        <h3 className="mgr-stat-value">{courses.filter(c => !c.assignedFaculty).length}</h3>
                    </div>
                </div>
            </div>

            <div className="mgr-main-grid">
                {/* Form Section */}
                <div className="mgr-form-section glass-panel">
                    <div className="mgr-section-header">
                        <UserPlus size={20} color="var(--primary)" />
                        <h3>{editingId ? 'Edit Faculty' : 'Add Faculty'}</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="mgr-form">
                        <div className="form-row">
                            <div className="mgr-group">
                                <label>Full Name</label>
                                <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="mgr-group">
                                <label>Employee ID</label>
                                <input type="text" className="input-field" required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="mgr-group">
                                <label>Email address</label>
                                <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="mgr-group">
                                <label>Department</label>
                                <select className="input-field" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                    <option>Computer Science</option>
                                    <option>Mechanical</option>
                                    <option>Electrical</option>
                                    <option>Business</option>
                                </select>
                            </div>
                        </div>
                        <div className="mgr-form-actions">
                            <button type="submit" className="primary-button" disabled={loading}>
                                {loading ? 'Processing...' : <><Save size={18} /> {editingId ? 'Update Record' : 'Save Faculty'}</>}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => {setEditingId(null); setFormData({ name: '', employeeId: '', email: '', department: 'Computer Science', designation: 'Professor' });}} className="mgr-cancel-btn">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Faculty List */}
                <div className="mgr-list-section glass-panel">
                    <div className="mgr-section-header">
                        <LayoutGrid size={20} color="var(--accent)" />
                        <h3>Faculty Roster</h3>
                    </div>
                    <div className="mgr-list">
                        {faculty.map(f => (
                            <div key={f.id} className="mgr-list-item">
                                <div className="mgr-item-info">
                                    <p className="mgr-item-name">{f.name}</p>
                                    <p className="mgr-item-sub"><Mail size={12} /> {f.email} | <Hash size={12} /> {f.employeeId}</p>
                                </div>
                                <div className="mgr-item-actions">
                                    <button onClick={() => handleEdit(f)} className="mgr-icon-btn edit"><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(f.id)} className="mgr-icon-btn delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Assignments */}
                <div className="mgr-list-section glass-panel full-width">
                    <div className="mgr-section-header">
                        <BookOpen size={20} color="var(--primary)" />
                        <h3>Course Assignments</h3>
                    </div>
                    <div className="mgr-assignment-grid">
                        {courses.map(c => (
                            <div key={c.id} className="mgr-assignment-card">
                                <div className="mgr-course-info">
                                    <p className="mgr-course-name">{c.courseName}</p>
                                    <p className="mgr-course-sub">{c.courseCode} • {c.assignedFaculty ? `Assigned to: ${c.assignedFaculty.name}` : 'No faculty assigned'}</p>
                                </div>
                                <select 
                                    className="mgr-assign-select"
                                    onChange={(e) => assignFacultyToCourse(c.id, e.target.value)}
                                    value={c.assignedFaculty?.id || ""}
                                >
                                    <option value="">Choose Faculty...</option>
                                    {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .mgr-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .mgr-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }

                .mgr-stat-card {
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .mgr-stat-icon {
                    width: 48px;
                    height: 48px;
                    opacity: 0.2;
                    position: absolute;
                    right: -4px;
                    bottom: -4px;
                    transform: rotate(-10deg);
                }

                .mgr-stat-label {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-dim);
                }

                .mgr-stat-value {
                    font-size: 32px;
                    margin: 4px 0 0;
                    font-weight: 900;
                }

                .accent-primary { border-left: 4px solid var(--primary); }
                .accent-success { border-left: 4px solid var(--success); }
                .accent-purple { border-left: 4px solid var(--accent); }

                .mgr-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .full-width { grid-column: span 2; }

                .mgr-section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--border-glass);
                }

                .mgr-section-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 800;
                }

                .mgr-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .mgr-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .mgr-group label {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    margin-left: 4px;
                }

                .mgr-form-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-top: 12px;
                }

                .mgr-cancel-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    font-weight: 700;
                    cursor: pointer;
                }

                .mgr-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .mgr-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                    border: 1px solid var(--border-glass);
                    transition: all 0.3s;
                }

                .mgr-list-item:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .mgr-item-name {
                    margin: 0;
                    font-weight: 700;
                    font-size: 14px;
                }

                .mgr-item-sub {
                    margin: 4px 0 0;
                    font-size: 11px;
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .mgr-item-actions {
                    display: flex;
                    gap: 8px;
                }

                .mgr-icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .mgr-icon-btn.edit:hover { color: var(--primary); border-color: var(--primary); }
                .mgr-icon-btn.delete:hover { color: var(--danger); border-color: var(--danger); }

                .mgr-assignment-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }

                .mgr-assignment-card {
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 16px;
                    border: 1px solid var(--border-glass);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .mgr-course-name {
                    margin: 0;
                    font-weight: 800;
                    font-size: 15px;
                }

                .mgr-course-sub {
                    margin: 4px 0 0;
                    font-size: 12px;
                    color: var(--text-dim);
                }

                .mgr-assign-select {
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: 10px;
                    color: var(--text-main);
                    font-size: 12px;
                    font-weight: 700;
                    outline: none;
                }

                /* Custom scrollbar */
                .mgr-list::-webkit-scrollbar { width: 4px; }
                .mgr-list::-webkit-scrollbar-track { background: transparent; }
                .mgr-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AdminFacultyManager;
