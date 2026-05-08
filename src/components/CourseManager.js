import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Layers, GraduationCap, Trash2 } from 'lucide-react';
import API from '../api';

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseName: '', courseCode: '', department: 'Computer Science', semester: '1', credits: 3 });
    const [filter, setFilter] = useState({ dept: 'All', sem: 'All' });
    const [loading, setLoading] = useState(false);

    const fetchCourses = async () => {
        try {
            const res = await API.get('/courses');
            setCourses(res.data || []);
        } catch (err) {
            console.error("Fetch Courses Error:", err);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/courses', newCourse);
            setNewCourse({ courseName: '', courseCode: '', department: 'Computer Science', semester: '1', credits: 3 });
            fetchCourses();
        } catch (err) {
            alert("Error creating course. Course code might already exist.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent delete this course?")) return;
        try {
            await API.delete(`/courses/${id}`);
            fetchCourses();
        } catch (err) {
            alert("Error: Course cannot be deleted while students are enrolled.");
        }
    };

    const handleUpdateSemester = async (course, newSem) => {
        try {
            await API.put(`/courses/${course.id}`, { semester: newSem });
            fetchCourses();
        } catch (err) {
            alert("Failed to update semester record.");
        }
    };

    return (
        <div className="course-mgr-container">
            <div className="course-mgr-header">
                <div className="mgr-icon-box"><BookOpen size={24} color="var(--primary)" /></div>
                <div className="mgr-title-group">
                    <h2 className="mgr-title">Course Management</h2>
                    <p className="mgr-subtitle">Manage curriculum modules and academic credit units.</p>
                </div>
            </div>

            <div className="course-mgr-layout">
                {/* Form Sidebar */}
                <div className="mgr-sidebar">
                    <div className="mgr-card glass-panel">
                        <div className="mgr-card-header">
                            <Plus size={18} />
                            <span>Add New Course</span>
                        </div>
                        <form onSubmit={handleSubmit} className="mgr-form">
                            <div className="mgr-field-group">
                                <label>Course Title</label>
                                <input 
                                    type="text" className="input-field" placeholder="e.g. Data Structures"
                                    value={newCourse.courseName} onChange={e => setNewCourse({...newCourse, courseName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="mgr-field-group">
                                <label>Identifier Code</label>
                                <input 
                                    type="text" className="input-field" placeholder="e.g. CS102"
                                    value={newCourse.courseCode} onChange={e => setNewCourse({...newCourse, courseCode: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="mgr-field-group">
                                <label>Department</label>
                                <select 
                                    className="input-field"
                                    value={newCourse.department} onChange={e => setNewCourse({...newCourse, department: e.target.value})}
                                >
                                    <option>Computer Science</option>
                                    <option>Mechanical</option>
                                    <option>Electrical</option>
                                    <option>Civil</option>
                                    <option>Business</option>
                                </select>
                            </div>
                            <div className="mgr-field-group">
                                <label>Semester</label>
                                <select 
                                    className="input-field"
                                    value={newCourse.semester} onChange={e => setNewCourse({...newCourse, semester: e.target.value})}
                                >
                                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="primary-button" disabled={loading}>
                                {loading ? 'Saving...' : 'Register Module'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="mgr-content">
                    <div className="mgr-card glass-panel">
                        <div className="mgr-card-header">
                            <Layers size={18} />
                            <span>Available Modules</span>
                            <div className="mgr-filters">
                                <select value={filter.dept} onChange={e => setFilter({...filter, dept: e.target.value})} className="filter-select">
                                    <option>All</option>
                                    <option>Computer Science</option>
                                    <option>Mechanical</option>
                                    <option>Electrical</option>
                                    <option>Civil</option>
                                    <option>Business</option>
                                </select>
                                <select value={filter.sem} onChange={e => setFilter({...filter, sem: e.target.value})} className="filter-select">
                                    <option value="All">All Semesters</option>
                                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="modules-grid">
                            {courses
                                .filter(c => filter.dept === 'All' || c.department === filter.dept)
                                .filter(c => filter.sem === 'All' || c.semester === filter.sem)
                                .map(course => (
                                <div key={course.id} className="module-item">
                                    <div className="module-top">
                                        <div className="module-badge">{course.courseCode}</div>
                                        <button 
                                            onClick={() => handleDelete(course.id)} 
                                            className="module-delete"
                                            title="Delete Course"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <h4 className="module-name">{course.courseName}</h4>
                                    <div className="module-info-row">
                                        <div className="module-dept">
                                            <GraduationCap size={14} /> <span>{course.department}</span>
                                        </div>
                                        <div className="module-sem-action">
                                            <select 
                                                className={`inline-sem-select ${!course.semester ? 'warning' : ''}`}
                                                value={course.semester || ''}
                                                onChange={(e) => handleUpdateSemester(course, e.target.value)}
                                            >
                                                <option value="" disabled>?</option>
                                                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {courses.length === 0 && (
                                <div className="empty-modules">
                                    <Layers size={48} opacity={0.1} />
                                    <p>No courses registered yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .course-mgr-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .course-mgr-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    border-bottom: 1px solid var(--border-glass);
                    padding-bottom: 24px;
                }

                .mgr-icon-box {
                    width: 52px;
                    height: 52px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border-glass);
                }

                .mgr-title { margin: 0; font-size: 24px; font-weight: 800; }
                .mgr-subtitle { margin: 4px 0 0; color: var(--text-dim); font-size: 14px; }

                .course-mgr-layout {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 32px;
                }

                .mgr-card { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
                
                .mgr-card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--border-glass);
                }

                .mgr-form { display: flex; flex-direction: column; gap: 20px; }
                .mgr-field-group { display: flex; flex-direction: column; gap: 8px; }
                .mgr-field-group label { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-left: 4px; }

                .modules-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 20px;
                }

                .module-item {
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 16px;
                    border: 1px solid var(--border-glass);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: all 0.3s;
                }

                .module-item:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .module-top { display: flex; justify-content: space-between; align-items: center; }
                .module-badge { font-size: 10px; font-weight: 800; background: var(--primary); color: white; padding: 4px 8px; border-radius: 6px; }
                .module-credits { font-size: 11px; font-weight: 700; color: var(--text-dim); }

                .module-delete {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .module-delete:hover { color: var(--danger); background: rgba(239, 68, 68, 0.1); }

                .module-name { margin: 0; font-size: 15px; font-weight: 800; color: var(--text-main); line-height: 1.4; }
                .module-info-row { display: flex; justify-content: space-between; align-items: center; }
                .module-dept { display: flex; alignItems: center; gap: 8px; font-size: 12px; color: var(--text-muted); font-weight: 600; }
                
                .inline-sem-select {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: var(--primary);
                    font-size: 10px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 6px;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .inline-sem-select:hover { background: rgba(59, 130, 246, 0.2); }
                .inline-sem-select.warning { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: var(--danger); box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }

                .mgr-filters { display: flex; gap: 10px; margin-left: auto; }
                .filter-select { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); color: var(--text-dim); border-radius: 8px; padding: 4px 12px; font-size: 12px; font-weight: 700; cursor: pointer; outline: none; transition: all 0.3s; }
                .filter-select:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.1); }

                .empty-modules {
                    grid-column: 1 / -1;
                    padding: 60px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    color: var(--text-dim);
                }

                @media (max-width: 1024px) {
                    .course-mgr-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default CourseManager;
