import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Save, Loader2, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import API from '../api';

const AttendanceManager = () => {
    const userRole = JSON.parse(localStorage.getItem('user'))?.role;
    const isAdmin = userRole === 'ADMIN';

    const [viewMode, setViewMode] = useState('STUDENT'); // 'STUDENT' or 'FACULTY'
    const [courses, setCourses] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [roster, setRoster] = useState([]);
    const [attendance, setAttendance] = useState({}); // {rollNumber/employeeId: 'PRESENT' | 'ABSENT'}
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            setViewMode('STUDENT');
        }
        fetchInitialData();
    }, [viewMode]);

    const fetchInitialData = async () => {
        try {
            setRoster([]);
            setSelectedCourse('');
            if (viewMode === 'STUDENT') {
                const endpoint = isAdmin ? '/courses' : '/courses/my-courses';
                const res = await API.get(endpoint);
                setCourses(res.data || []);
                if (res.data?.length > 0 && !selectedCourse) {
                    setSelectedCourse(res.data[0].id);
                }
            } else {
                const res = await API.get('/faculty');
                setFacultyList(res.data || []);
                setRoster(res.data || []);
                const initial = {};
                (res.data || []).forEach(f => {
                    initial[f.employeeId] = 'PRESENT';
                });
                setAttendance(initial);
            }
        } catch (err) {
            console.error("Fetch Data Error:", err);
        }
    };

    useEffect(() => {
        if (viewMode === 'STUDENT' && selectedCourse) {
            fetchStudentsInCourse();
        } else if (viewMode === 'STUDENT') {
            setRoster([]);
        }
    }, [selectedCourse, viewMode]);

    const fetchStudentsInCourse = async () => {
        if (!selectedCourse) return;
        setFetching(true);
        try {
            const res = await API.get(`/academic/enrollments/course/${selectedCourse}`);
            setRoster(res.data || []);
            const initial = {};
            (res.data || []).forEach(s => {
                initial[s.rollNumber] = 'PRESENT';
            });
            setAttendance(initial);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleToggle = (id, status) => {
        setAttendance({ ...attendance, [id]: status });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (viewMode === 'STUDENT') {
                const records = roster.map(s => ({
                    rollNumber: s.rollNumber,
                    courseId: selectedCourse,
                    date: date,
                    status: attendance[s.rollNumber]
                }));
                await API.post('/academic/attendance/mark', records);
            } else {
                const records = roster.map(f => ({
                    employeeId: f.employeeId,
                    date: date,
                    status: attendance[f.employeeId]
                }));
                await API.post('/academic/attendance/faculty/mark', records);
            }
            alert("Attendance Committed Successfully!");
        } catch (err) {
            alert("Error syncing attendance protocol.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attendance-mgr-container">
            <div className="mgr-header">
                <div className="mgr-icon-box"><Calendar size={24} color="var(--primary)" /></div>
                <div className="mgr-title-group">
                    <h2 className="mgr-title">{viewMode === 'STUDENT' ? 'Student Attendance' : 'Faculty Attendance'}</h2>
                    <p className="mgr-subtitle">
                        {viewMode === 'STUDENT' 
                            ? 'Sync daily attendance records for academic subjects.' 
                            : 'Manage daily presence logs for faculty personnel.'}
                    </p>
                </div>
                {isAdmin && (
                    <div className="view-toggle glass-panel">
                        <button 
                            className={`toggle-btn ${viewMode === 'STUDENT' ? 'active' : ''}`}
                            onClick={() => { setViewMode('STUDENT'); setSelectedCourse(''); }}
                        >
                            <Users size={16} /> Students
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === 'FACULTY' ? 'active' : ''}`}
                            onClick={() => setViewMode('FACULTY')}
                        >
                            <ShieldCheck size={16} /> Faculty
                        </button>
                    </div>
                )}
            </div>

            <div className="attendance-controls glass-panel">
                <div className="control-form">
                    {viewMode === 'STUDENT' && (
                        <div className="field-group">
                            <label>Select Subject</label>
                            <div className="subject-pills-container">
                                {courses.length > 0 ? courses.map(c => (
                                    <button 
                                        key={c.id}
                                        className={`subject-pill ${selectedCourse == c.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCourse(c.id)}
                                    >
                                        <BookOpen size={14} />
                                        <span>{c.courseName} ({c.courseCode}) <small style={{opacity: 0.7}}>Sem {c.semester}</small></span>
                                    </button>
                                )) : (
                                    <p className="no-courses-msg">No subjects available.</p>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="field-group date-group">
                        <label>Date Registry</label>
                        <input 
                            type="date" className="input-field"
                            value={date} onChange={e => setDate(e.target.value)}
                        />
                    </div>
                </div>
                {fetching && (
                    <div className="loading-overlay-inline">
                        <Loader2 size={18} className="animate-spin" />
                        <span>Synchronizing Roster...</span>
                    </div>
                )}
            </div>

            {roster.length > 0 ? (
                <div className="roster-section animate-slide-up">
                    <div className="mgr-card glass-panel">
                        <div className="card-header-row">
                            <h3 className="card-title">
                                <Sparkles size={18} color="var(--primary)" /> 
                                {viewMode === 'STUDENT' ? 'Student Roster' : 'Faculty List'}
                            </h3>
                            <button onClick={() => {
                                const all = {}; roster.forEach(item => {
                                    const id = viewMode === 'STUDENT' ? item.rollNumber : item.employeeId;
                                    all[id] = 'PRESENT';
                                }); 
                                setAttendance(all);
                            }} className="action-link">Mark All Present</button>
                        </div>

                        <div className="roster-table">
                            <div className="table-head">
                                <span>{viewMode === 'STUDENT' ? 'Student Identity' : 'Faculty Identity'}</span>
                                <span>Status Marking</span>
                            </div>
                            <div className="table-body">
                                {roster.map(item => {
                                    const id = viewMode === 'STUDENT' ? item.rollNumber : item.employeeId;
                                    return (
                                        <div key={item.id} className="table-row">
                                            <div className="student-profile">
                                                <div className="avatar">{item.name[0]}</div>
                                                <div className="details">
                                                    <p className="name">{item.name}</p>
                                                    <p className="id-sub">{id}</p>
                                                </div>
                                            </div>
                                            <div className="status-actions">
                                                <button 
                                                    onClick={() => handleToggle(id, 'PRESENT')}
                                                    className={`status-btn present ${attendance[id] === 'PRESENT' ? 'active' : ''}`}
                                                >
                                                    <CheckCircle size={14} /> Present
                                                </button>
                                                <button 
                                                    onClick={() => handleToggle(id, 'ABSENT')}
                                                    className={`status-btn absent ${attendance[id] === 'ABSENT' ? 'active' : ''}`}
                                                >
                                                    <XCircle size={14} /> Absent
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="roster-footer">
                             <button 
                                onClick={handleSave} 
                                className="primary-button submit-action"
                                disabled={loading}
                             >
                                {loading ? 'Synchronizing...' : (
                                    <>
                                        Commit {viewMode === 'STUDENT' ? 'Student' : 'Faculty'} Record <Save size={18} />
                                    </>
                                )}
                             </button>
                        </div>
                    </div>
                </div>
            ) : selectedCourse || viewMode === 'FACULTY' ? (
                <div className="empty-roster-state glass-panel animate-slide-up">
                    <Users size={48} className="empty-icon" />
                    <h3>No Active Registry Found</h3>
                    <p>
                        There are currently no {viewMode === 'STUDENT' ? 'students enrolled in this subject' : 'faculty members registered in the system'}.
                    </p>
                    {isAdmin && viewMode === 'STUDENT' && (
                        <p className="hint">Tip: Use the Management Hub to enroll students in this course.</p>
                    )}
                </div>
            ) : null}

            <style>{`
                .attendance-mgr-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .mgr-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    border-bottom: 1px solid var(--border-glass);
                    padding-bottom: 24px;
                    position: relative;
                }

                .view-toggle {
                    margin-left: auto;
                    display: flex;
                    padding: 4px;
                    gap: 4px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.02);
                }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    color: var(--text-dim);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .toggle-btn.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 4px 12px var(--primary-glow);
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

                .attendance-controls { padding: 32px; }
                .control-form { display: flex; gap: 24px; align-items: flex-start; }
                .field-group { display: flex; flex-direction: column; gap: 10px; flex: 1; }
                .date-group { width: 220px; flex: none; }
                .field-group label { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-left: 4px; }
                
                .subject-pills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .subject-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 18px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: 12px;
                    color: var(--text-dim);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .subject-pill:hover {
                    background: rgba(255, 255, 255, 0.06);
                    color: var(--text-main);
                }

                .subject-pill.active {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: var(--primary);
                    color: var(--primary);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
                }

                .no-courses-msg {
                    color: var(--danger);
                    font-size: 13px;
                    font-weight: 700;
                    margin: 0;
                    padding: 8px 0;
                }

                .loading-overlay-inline {
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--primary);
                    font-size: 13px;
                    font-weight: 700;
                }

                .mgr-card { padding: 32px; }
                .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .card-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; margin: 0; }
                
                .action-link {
                    background: transparent;
                    border: none;
                    color: var(--primary);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-link:hover { opacity: 0.8; }

                .roster-table { display: flex; flex-direction: column; }
                .table-head { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 0 16px 12px; 
                    border-bottom: 1px solid var(--border-glass);
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .table-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
                    transition: background 0.2s;
                }
                .table-row:hover { background: rgba(255, 255, 255, 0.01); }

                .student-profile { display: flex; align-items: center; gap: 16px; }
                .avatar {
                    width: 38px;
                    height: 38px;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    border: 1px solid var(--border-glass);
                }
                .details .name { margin: 0; font-size: 14px; font-weight: 700; color: var(--text-main); }
                .details .id-sub { margin: 2px 0 0; font-size: 12px; color: var(--text-dim); }

                .status-actions { display: flex; gap: 12px; }
                .status-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 10px;
                    border: 1px solid var(--border-glass);
                    background: transparent;
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-dim);
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .status-btn.present.active { background: rgba(16, 185, 129, 0.1); color: var(--success); border-color: rgba(16, 185, 129, 0.3); }
                .status-btn.absent.active { background: rgba(239, 68, 68, 0.1); color: var(--danger); border-color: rgba(239, 68, 68, 0.3); }
                .status-btn:not(.active):hover { border-color: rgba(255, 255, 255, 0.1); color: var(--text-main); }

                .roster-footer { margin-top: 32px; display: flex; justify-content: center; }
                .submit-action { padding: 14px 48px; min-width: 300px; }

                .empty-roster-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 40px;
                    text-align: center;
                    gap: 16px;
                }

                .empty-icon {
                    color: rgba(255, 255, 255, 0.05);
                    margin-bottom: 8px;
                }

                .empty-roster-state h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 800;
                }

                .empty-roster-state p {
                    margin: 0;
                    color: var(--text-dim);
                    font-size: 14px;
                    max-width: 400px;
                }

                .hint {
                    color: var(--primary) !important;
                    font-weight: 700;
                    font-size: 12px !important;
                }

                @media (max-width: 1024px) {
                    .control-form { flex-direction: column; align-items: stretch; }
                    .mgr-header { flex-direction: column; align-items: flex-start; }
                    .view-toggle { margin-left: 0; margin-top: 16px; width: 100%; }
                    .toggle-btn { flex: 1; justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default AttendanceManager;
