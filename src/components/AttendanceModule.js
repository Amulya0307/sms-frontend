import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../api';

const AttendanceModule = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await API.get('/academic/attendance/me');
                setAttendanceData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    if (loading) return (
        <div className="module-loader">Synchronizing presence certificates...</div>
    );

    return (
        <div className="attendance-module-container">
            <div className="module-header">
                <h3 className="module-title">Institutional Presence</h3>
                <p className="module-subtitle">Chronological participation metrics and historical execution logs.</p>
            </div>

            <div className="attendance-roster">
                {attendanceData.map((course, idx) => (
                    <div key={idx} className={`course-tile glass-panel ${expandedCourse === idx ? 'expanded' : ''}`}>
                        <div className="tile-header" onClick={() => setExpandedCourse(expandedCourse === idx ? null : idx)}>
                            <div className="course-meta">
                                <h4 className="course-name">{course.courseName}</h4>
                                <div className="presence-stats">
                                    <span className={`percentage ${course.percentage >= 75 ? 'safe' : 'risk'}`}>
                                        {course.percentage.toFixed(1)}% Present
                                    </span>
                                    <span className="divider">•</span>
                                    <span className="count">{course.present} of {course.total} Sessions</span>
                                </div>
                            </div>
                            
                            <div className="header-actions">
                                <div className="progress-viz">
                                    <svg width="42" height="42">
                                        <circle cx="21" cy="21" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                        <circle 
                                            cx="21" cy="21" r="18" fill="none" 
                                            stroke={course.percentage >= 75 ? 'var(--accent)' : 'var(--danger)'} 
                                            strokeWidth="4" 
                                            strokeDasharray={`${(course.percentage / 100) * 113} 113`}
                                            strokeLinecap="round"
                                            transform="rotate(-90 21 21)"
                                        />
                                    </svg>
                                </div>
                                <div className={`chevron ${expandedCourse === idx ? 'up' : 'down'}`}>
                                    {expandedCourse === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>
                        </div>

                        {expandedCourse === idx && (
                            <div className="history-expansion animate-entrance">
                                <h5 className="expansion-title"><Clock size={14} /> Historical Roster Entries</h5>
                                <div className="log-chain">
                                    {course.history.map((log, lIdx) => (
                                        <div key={lIdx} className="log-entry">
                                            <div className="log-date">
                                                <Calendar size={14} className="icon" />
                                                <span>{log.date}</span>
                                            </div>
                                            <div className={`log-pill ${log.status === 'PRESENT' ? 'present' : 'absent'}`}>
                                                {log.status === 'PRESENT' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                                                <span>{log.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {course.history.length === 0 && (
                                        <div className="empty-log">No historical entries recorded for this course.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {attendanceData.length === 0 && (
                <div className="attendance-empty glass-panel">
                    <AlertCircle size={40} color="var(--text-dim)" />
                    <p>No participation records synchronized to this digital identity.</p>
                </div>
            )}

            <style>{`
                .attendance-module-container { display: flex; flex-direction: column; gap: 24px; }
                .module-title { font-size: 22px; font-weight: 800; margin: 0; color: var(--text-main); }
                .module-subtitle { font-size: 14px; color: var(--text-dim); margin: 4px 0 0; font-weight: 600; }

                .attendance-roster { display: flex; flex-direction: column; gap: 16px; }
                .course-tile { padding: 20px 24px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .course-tile.expanded { background: rgba(59, 130, 246, 0.03); border-color: rgba(59, 130, 246, 0.2); }
                
                .tile-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                
                .course-meta { display: flex; flex-direction: column; gap: 6px; }
                .course-name { margin: 0; font-size: 17px; font-weight: 800; color: var(--text-main); }
                .presence-stats { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: var(--text-dim); }
                .percentage.safe { color: var(--accent); }
                .percentage.risk { color: var(--danger); }
                .divider { opacity: 0.1; }
                
                .header-actions { display: flex; align-items: center; gap: 24px; }
                .chevron { color: var(--text-muted); transition: transform 0.3s; }
                .chevron.up { color: var(--text-main); }

                .history-expansion { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-glass); }
                .expansion-title { margin: 0 0 16px; font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; }
                
                .log-chain { display: flex; flex-direction: column; gap: 8px; }
                .log-entry { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 12px 16px; 
                    background: rgba(255,255,255,0.02); 
                    border-radius: 12px; 
                    border: 1px solid var(--border-glass); 
                }
                .log-date { font-size: 13px; color: var(--text-main); font-weight: 700; display: flex; align-items: center; gap: 10px; }
                .log-date .icon { color: var(--text-dim); }
                
                .log-pill { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
                .log-pill.present { background: rgba(16, 185, 129, 0.1); color: var(--accent); }
                .log-pill.absent { background: rgba(244, 63, 94, 0.1); color: var(--danger); }

                .attendance-empty { padding: 60px; text-align: center; display: flex; flex-direction: column; alignItems: center; gap: 16px; color: var(--text-dim); }
                .module-loader { padding: 40px; text-align: center; color: var(--primary); font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; font-size: 14px; }
            `}</style>
        </div>
    );
};

export default AttendanceModule;
