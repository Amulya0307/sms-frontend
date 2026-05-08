import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Briefcase, Calendar, ArrowLeft, Loader2, CheckCircle2, XCircle, AlertCircle, Sparkles, Building2, BookOpen, Layers } from 'lucide-react';
import API from '../api';

const FacultyProfile = () => {
    const [faculty, setFaculty] = useState(null);
    const [courses, setCourses] = useState([]);
    const [attendance, setAttendance] = useState({ present: 0, total: 0, percentage: 0, history: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profRes, attRes, courseRes] = await Promise.all([
                    API.get('/faculty/me'),
                    API.get('/academic/attendance/faculty/me'),
                    API.get('/courses/my-courses')
                ]);
                setFaculty(profRes.data);
                setAttendance(attRes.data);
                setCourses(courseRes.data || []);
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                if (err.response?.status === 401) navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [navigate]);

    if (loading) return (
        <div className="profile-loading-screen">
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            <p>Accessing Faculty Records...</p>
            <style>{`
                .profile-loading-screen { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
                .profile-loading-screen p { font-weight: 800; letter-spacing: 0.1em; color: var(--text-dim); text-transform: uppercase; }
            `}</style>
        </div>
    );

    return (
        <div className="faculty-profile-page">
            <div className="profile-container animate-slide-up">
                {/* Header Navigation */}
                <header className="profile-header">
                    <button onClick={() => navigate('/faculty-dashboard')} className="action-back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="title-group">
                        <h1>Faculty Dossier</h1>
                        <p>Institutional identity and professional presence metrics.</p>
                    </div>
                </header>

                <div className="profile-layout-grid">
                    {/* Identity Column */}
                    <div className="identity-sector">
                        <div className="identity-card glass-panel main-info">
                            <div className="avatar-shield">
                                <div className="avatar-placeholder">{faculty?.name?.[0]}</div>
                                <div className="status-indicator online"></div>
                            </div>
                            
                            <h2 className="educator-name">{faculty?.name}</h2>
                            <div className="designation-chip">{faculty?.designation}</div>
                            
                            <div className="info-attribute-list">
                                <div className="attribute-item">
                                    <Shield size={16} />
                                    <span>ID: {faculty?.employeeId}</span>
                                </div>
                                <div className="attribute-item">
                                    <Building2 size={16} />
                                    <span className="dept-text">Department of {courses.length > 0 ? (courses[0].department || faculty?.department) : (faculty?.department || 'General Academics')}</span>
                                </div>
                                <div className="attribute-item">
                                    <Mail size={16} />
                                    <span>{faculty?.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="identity-card glass-panel stats-info">
                            <h3 className="section-subtitle">Reliability Metrics</h3>
                            <div className="stat-radial-group">
                                <div className="stat-circle">
                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle" strokeDasharray={`${attendance.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="percentage-display">
                                        <span className="value">{Math.round(attendance.percentage)}%</span>
                                        <span className="label">Present</span>
                                    </div>
                                </div>
                                
                                <div className="stat-counters">
                                    <div className="counter-bit">
                                        <span className="count-val">{attendance.present}</span>
                                        <span className="count-lab">Days Active</span>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="counter-bit">
                                        <span className="count-val">{attendance.total}</span>
                                        <span className="count-lab">Total Cycle</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Column */}
                    <div className="history-sector glass-panel">
                        <div className="sector-header">
                            <div className="header-meta">
                                <Calendar size={20} className="icon-grad" />
                                <h3>Attendance Log</h3>
                            </div>
                            <div className="log-filter">Latest Activity</div>
                        </div>

                        <div className="attendance-timeline">
                            {attendance.history.length > 0 ? (
                                [...attendance.history].reverse().map((record, index) => (
                                    <div key={index} className="timeline-entry">
                                        <div className="entry-date">
                                            <span className="day">{new Date(record.date).getDate()}</span>
                                            <span className="month">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        </div>
                                        <div className="entry-content">
                                            <div className="point-indicator"></div>
                                            <div className="record-details">
                                                <span className="date-full">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}</span>
                                                <div className={`status-pill ${record.status.toLowerCase()}`}>
                                                    {record.status === 'PRESENT' ? <CheckCircle2 size={12} /> : 
                                                     record.status === 'ABSENT' ? <XCircle size={12} /> : <AlertCircle size={12} />}
                                                    {record.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-log">
                                    <Sparkles size={40} className="empty-icon" />
                                    <p>No attendance records found in the current institutional cycle.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assigned Subjects Section */}
                    <div className="attribute-card glass-panel" style={{ marginTop: '24px' }}>
                        <div className="card-heading">
                            <BookOpen size={18} color="var(--primary)" />
                            <h4>Assigned Subjects</h4>
                        </div>
                        <div className="courses-list-mini">
                            {courses.length > 0 ? courses.map(c => (
                                <div key={c.id} className="mini-course-item">
                                    <div className="mini-course-icon"><Layers size={14} /></div>
                                    <div className="mini-course-info">
                                        <p className="mini-name">{c.courseName} <span className="mini-dept-tag">({c.department})</span></p>
                                        <p className="mini-code">{c.courseCode} • Semester {c.semester || '1'}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="empty-msg">No subjects assigned for current term.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .faculty-profile-page { min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; }
                .profile-container { width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 32px; }

                .profile-header { display: flex; align-items: center; gap: 24px; }
                .action-back-btn { width: 44px; height: 44px; border-radius: 12px; background: rgba(59, 130, 246, 0.05); border: 1px solid var(--border-glass); color: var(--primary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .action-back-btn:hover { background: var(--primary); color: white; transform: translateX(-4px); }
                .title-group h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.04em; background: linear-gradient(135deg, var(--text-main), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title-group p { margin: 4px 0 0; color: var(--text-dim); font-weight: 600; font-size: 14px; }

                .profile-layout-grid { display: grid; grid-template-columns: 350px 1fr; gap: 32px; }

                .identity-sector { display: flex; flex-direction: column; gap: 24px; }
                .identity-card { padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center; }
                
                .avatar-shield { position: relative; margin-bottom: 24px; }
                .avatar-placeholder { width: 90px; height: 90px; background: linear-gradient(135deg, var(--primary), #60a5fa); border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 900; color: white; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
                .status-indicator { position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px; border: 4px solid #0f172a; border-radius: 50%; background: #10b981; }

                .educator-name { margin: 0; font-size: 24px; font-weight: 800; }
                .designation-chip { margin-top: 8px; padding: 6px 16px; background: rgba(59, 130, 246, 0.1); color: var(--primary); border-radius: 20px; font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }

                .info-attribute-list { width: 100%; margin-top: 32px; display: flex; flex-direction: column; gap: 16px; text-align: left; }
                .attribute-item { display: flex; align-items: center; gap: 12px; color: var(--text-dim); font-size: 14px; font-weight: 600; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid var(--border-glass); }
                .dept-text { color: #f59e0b; font-weight: 800; }
                
                .attribute-card { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
                .card-heading { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--border-glass); }
                .card-heading h4 { margin: 0; font-size: 13px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
                
                .courses-list-mini { display: flex; flex-direction: column; gap: 12px; }
                .mini-course-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid var(--border-glass); transition: all 0.2s; }
                .mini-course-item:hover { background: rgba(255,255,255,0.04); border-color: var(--primary); }
                .mini-course-icon { width: 32px; height: 32px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .mini-course-info { text-align: left; }
                .mini-name { margin: 0; font-size: 14px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
                .mini-dept-tag { font-size: 10px; color: var(--primary); opacity: 0.8; font-weight: 800; text-transform: uppercase; }
                .mini-code { margin: 2px 0 0; font-size: 11px; color: var(--text-dim); font-weight: 600; }
                .empty-msg { font-size: 12px; color: var(--text-muted); font-style: italic; }

                .section-subtitle { align-self: flex-start; margin: 0 0 24px; font-size: 14px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
                
                .stat-radial-group { display: flex; align-items: center; justify-content: space-between; width: 100%; }
                .stat-circle { position: relative; width: 100px; height: 100px; }
                .circular-chart { width: 100px; height: 100px; }
                .circle-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 3; }
                .circle { fill: none; stroke-width: 3; stroke-linecap: round; stroke: var(--primary); transition: stroke-dasharray 1s ease 0s; }
                .percentage-display { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .percentage-display .value { font-size: 20px; font-weight: 900; }
                .percentage-display .label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }

                .stat-counters { display: flex; flex-direction: column; gap: 12px; flex: 1; margin-left: 24px; }
                .counter-bit { display: flex; flex-direction: column; }
                .count-val { font-size: 22px; font-weight: 900; }
                .count-lab { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; }
                .divider { height: 1px; background: var(--border-glass); width: 40px; }

                .history-sector { display: flex; flex-direction: column; overflow: hidden; }
                .sector-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); }
                .header-meta { display: flex; align-items: center; gap: 12px; }
                .icon-grad { color: var(--primary); }
                .sector-header h3 { margin: 0; font-size: 20px; font-weight: 800; }
                .log-filter { font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }

                .attendance-timeline { flex: 1; padding: 32px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }
                .timeline-entry { display: flex; gap: 24px; }
                .entry-date { width: 40px; display: flex; flex-direction: column; align-items: center; }
                .entry-date .day { font-size: 20px; font-weight: 900; line-height: 1; }
                .entry-date .month { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--primary); margin-top: 4px; }

                .entry-content { position: relative; flex: 1; display: flex; align-items: flex-start; gap: 20px; }
                .point-indicator { margin-top: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px var(--primary); z-index: 1; }
                .entry-content:after { content: ''; position: absolute; left: 3.5px; top: 16px; width: 1px; height: calc(100% + 16px); background: linear-gradient(to bottom, var(--primary), transparent); opacity: 0.2; }
                .timeline-entry:last-child .entry-content:after { display: none; }

                .record-details { flex: 1; display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 16px; transition: transform 0.2s; }
                .record-details:hover { transform: translateX(8px); background: rgba(255,255,255,0.04); }
                .date-full { font-weight: 700; font-size: 14px; color: var(--text-dim); }

                .status-pill { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; border: 1px solid transparent; }
                .status-pill.present { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
                .status-pill.absent { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border-color: rgba(244, 63, 94, 0.2); }
                .status-pill.on_leave { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }

                .empty-log { padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 20px; color: var(--text-dim); text-align: center; }
                .empty-icon { color: var(--primary); opacity: 0.3; }
                .empty-log p { max-width: 300px; font-weight: 600; line-height: 1.6; }

                @media (max-width: 900px) {
                    .profile-layout-grid { grid-template-columns: 1fr; }
                    .identity-sector { order: 1; }
                    .history-sector { order: 2; }
                }
            `}</style>
        </div>
    );
};

export default FacultyProfile;
