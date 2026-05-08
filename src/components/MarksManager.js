import React, { useState, useEffect } from 'react';
import { BookOpen, UserCheck, Save, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import API from '../api';

const MarksManager = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // {rollNumber: {INTERNAL: 0, SEMESTER: 0}}
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get('/courses/my-courses');
                setCourses(res.data || []);
                if (res.data?.length > 0 && !selectedCourse) {
                    setSelectedCourse(res.data[0].id);
                }
            } catch (err) {
                console.error("Fetch Courses Error:", err);
            }
        };
        fetchCourses();
    }, [selectedCourse]);

    // Automatic roster fetching when course changes
    useEffect(() => {
        if (selectedCourse) {
            fetchStudentsInCourse();
        } else {
            setStudents([]);
        }
    }, [selectedCourse]);

    const fetchStudentsInCourse = async () => {
        if (!selectedCourse) return;
        setFetching(true);
        try {
            const res = await API.get(`/academic/enrollments/course/${selectedCourse}`);
            setStudents(res.data || []);
            
            const initial = {};
            (res.data || []).forEach(s => {
                initial[s.rollNumber] = { INTERNAL: 0, SEMESTER: 0 };
            });
            setMarks(initial);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleMarkChange = (rollNumber, type, value) => {
        setMarks({
            ...marks,
            [rollNumber]: {
                ...marks[rollNumber],
                [type]: parseFloat(value) || 0
            }
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const records = [];
            students.forEach(s => {
                records.push({
                    rollNumber: s.rollNumber,
                    courseId: selectedCourse,
                    markType: 'INTERNAL',
                    score: marks[s.rollNumber].INTERNAL,
                    maxScore: 40.0,
                    semester: 'CURRENT'
                });
                records.push({
                    rollNumber: s.rollNumber,
                    courseId: selectedCourse,
                    markType: 'SEMESTER',
                    score: marks[s.rollNumber].SEMESTER,
                    maxScore: 60.0,
                    semester: 'CURRENT'
                });
            });
            await API.post('/grades/mark', records);
            alert("Academic Performance Synchronized!");
        } catch (err) {
            alert("Error syncing grades.");
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (m) => {
        return (m.INTERNAL + m.SEMESTER).toFixed(1);
    };

    return (
        <div className="marks-mgr-container">
            <div className="mgr-header">
                <div className="mgr-icon-box"><TrendingUp size={24} color="var(--primary)" /></div>
                <div className="mgr-title-group">
                    <h2 className="mgr-title">Performance Metrics</h2>
                    <p className="mgr-subtitle">Evaluate scholarly progress for your assigned subjects.</p>
                </div>
            </div>

            <div className="marks-controls glass-panel">
                <div className="control-row">
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
                                    <span>{c.courseName} ({c.courseCode})</span>
                                </button>
                            )) : (
                                <p className="no-courses-msg">No subjects assigned yet.</p>
                            )}
                        </div>
                    </div>
                </div>
                {fetching && (
                    <div className="loading-overlay-inline">
                        <Loader2 size={18} className="animate-spin" />
                        <span>Synchronizing Evaluation Roster...</span>
                    </div>
                )}
            </div>

            {students.length > 0 && (
                <div className="roster-section animate-slide-up">
                    <div className="mgr-card glass-panel">
                        <div className="card-header-row">
                            <h3 className="card-title"><Sparkles size={18} color="var(--primary)" /> Student Evaluation</h3>
                            <div className="score-legend">
                                <span>Internal: 40</span>
                                <span>Semester: 60</span>
                            </div>
                        </div>

                        <div className="marks-table">
                            <div className="table-head">
                                <span className="col-student">Student Identity</span>
                                <span className="col-score">Internal</span>
                                <span className="col-score">Semester</span>
                                <span className="col-total">Aggregate</span>
                            </div>
                            <div className="table-body">
                                {students.map(s => (
                                    <div key={s.id} className="table-row">
                                        <div className="student-profile col-student">
                                            <div className="avatar">{s.name[0]}</div>
                                            <div className="details">
                                                <p className="name">{s.name}</p>
                                                <p className="id-sub">{s.rollNumber}</p>
                                            </div>
                                        </div>
                                        <div className="col-score">
                                            <input 
                                                type="number" className="input-field score-input"
                                                value={marks[s.rollNumber]?.INTERNAL}
                                                onChange={e => handleMarkChange(s.rollNumber, 'INTERNAL', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-score">
                                            <input 
                                                type="number" className="input-field score-input"
                                                value={marks[s.rollNumber]?.SEMESTER}
                                                onChange={e => handleMarkChange(s.rollNumber, 'SEMESTER', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-total">
                                            <span className="total-badge">
                                                {calculateTotal(marks[s.rollNumber])}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="roster-footer">
                             <button 
                                onClick={handleSave} 
                                className="primary-button submit-action"
                                disabled={loading}
                             >
                                {loading ? 'Synchronizing performance...' : (
                                    <>
                                        Commit Academic Records <Save size={18} />
                                    </>
                                )}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .marks-mgr-container {
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

                .marks-controls { padding: 32px; }
                .control-row { display: flex; gap: 24px; align-items: flex-start; }
                .field-group { flex: 1; display: flex; flex-direction: column; gap: 10px; }
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

                .fetch-btn {
                    height: 48px;
                    padding: 0 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .mgr-card { padding: 32px; }
                .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .card-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; margin: 0; }
                
                .score-legend { display: flex; gap: 16px; font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; }

                .marks-table { display: flex; flex-direction: column; }
                .table-head { 
                    display: flex; 
                    padding: 0 16px 12px; 
                    border-bottom: 1px solid var(--border-glass);
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .col-student { flex: 2; }
                .col-score { flex: 1; text-align: center; }
                .col-total { flex: 1; text-align: right; }

                .table-row {
                    display: flex;
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

                .score-input { 
                    width: 80px !important; 
                    text-align: center; 
                    margin: 0 auto;
                    height: 40px !important;
                }

                .total-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary);
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 15px;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .roster-footer { margin-top: 32px; display: flex; justify-content: center; }
                .submit-action { padding: 14px 48px; min-width: 350px; }

                @media (max-width: 1024px) {
                    .control-row { flex-direction: column; align-items: stretch; }
                }
            `}</style>
        </div>
    );
};

export default MarksManager;
