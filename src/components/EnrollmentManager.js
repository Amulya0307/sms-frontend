import React, { useState, useEffect } from 'react';
import { UserCheck, BookOpen, Send, User, Info } from 'lucide-react';
import API from '../api';

const EnrollmentManager = () => {
    const [courses, setCourses] = useState([]);
    const [rollNumber, setRollNumber] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [semester, setSemester] = useState('1st');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const endpoint = user.role === 'FACULTY' ? '/courses/my-courses' : '/courses';
                const res = await API.get(endpoint);
                setCourses(res.data || []);
                if (res.data?.length > 0) setSelectedCourse(res.data[0].id);
            } catch (err) {
                console.error("Fetch Courses Error:", err);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await API.post('/academic/enroll', {
                rollNumber,
                courseId: selectedCourse,
                semester
            });
            setMessage({ type: 'success', text: `Enrollment successful for student: ${rollNumber}` });
            setRollNumber('');
        } catch (err) {
            setMessage({ type: 'error', text: 'Enrollment Error: Verify roll number and course availability.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enroll-mgr-container">
            <div className="mgr-header">
                <div className="mgr-icon-box"><UserCheck size={24} color="var(--primary)" /></div>
                <div className="mgr-title-group">
                    <h2 className="mgr-title">Course Enrollment</h2>
                    <p className="mgr-subtitle">Manually enroll students into course modules.</p>
                </div>
            </div>

            <div className="enroll-content-grid">
                <div className="mgr-card glass-panel">
                    <form onSubmit={handleEnroll} className="mgr-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label><User size={13} /> Student Roll Number</label>
                                <input 
                                    type="text" className="input-field" placeholder="e.g. CS2024-001"
                                    value={rollNumber} onChange={e => setRollNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label><BookOpen size={13} /> Select Course</label>
                                <select 
                                    className="input-field"
                                    value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.courseCode} - {c.courseName} (Sem {c.semester})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Target Semester</label>
                                <select 
                                    className="input-field"
                                    value={semester} onChange={e => setSemester(e.target.value)}
                                >
                                    <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                                    <option>5th</option><option>6th</option><option>7th</option><option>8th</option>
                                </select>
                            </div>
                            <div className="form-action">
                                <button type="submit" className="primary-button" disabled={loading}>
                                    {loading ? 'Processing...' : (
                                        <>
                                            Enroll student <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`mgr-message ${message.type}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>

                <div className="info-sidebar">
                    <div className="mgr-card glass-panel info-card">
                        <div className="info-header">
                            <Info size={18} color="var(--primary)" />
                            <h4>Enrollment Guidelines</h4>
                        </div>
                        <ul className="info-list">
                            <li>Ensure the <strong>Student Roll Number</strong> exists in the database.</li>
                            <li>A student cannot be enrolled in the <strong>same course</strong> twice.</li>
                            <li>Enrollment affects <strong>attendance</strong> and <strong>marks</strong> modules instantly.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style>{`
                .enroll-mgr-container {
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

                .enroll-content-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 32px;
                }

                .mgr-card { padding: 40px; }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 28px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .form-group label {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    margin-left: 4px;
                }

                .form-action {
                    grid-column: span 2;
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 12px;
                }

                .mgr-message {
                    grid-column: span 2;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 12px;
                }

                .mgr-message.success { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }
                .mgr-message.error { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); }

                .info-card { padding: 24px !important; }
                .info-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
                .info-header h4 { margin: 0; font-size: 16px; font-weight: 800; }

                .info-list {
                    padding: 0;
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .info-list li {
                    font-size: 13px;
                    color: var(--text-dim);
                    line-height: 1.6;
                    padding-left: 12px;
                    border-left: 2px solid rgba(255, 255, 255, 0.1);
                }

                @media (max-width: 1024px) {
                    .enroll-content-grid { grid-template-columns: 1fr; }
                    .form-grid { grid-template-columns: 1fr; }
                    .form-action { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

export default EnrollmentManager;
