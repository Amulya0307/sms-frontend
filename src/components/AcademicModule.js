import React, { useState, useEffect } from 'react';
import { Book, TrendingUp, Calendar, Hash, Target, ClipboardList } from 'lucide-react';
import API from '../api';

const AcademicModule = ({ student }) => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await API.get('/grades/me');
                setGrades(res.data);
            } catch (err) {
                console.error("Error fetching grades:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    return (
        <div className="academic-module-container">
            <div className="merit-stats-grid">
                {/* CGPA Card */}
                <div className="stat-card crystal-primary animate-fade-in">
                    <div className="stat-meta">
                        <TrendingUp size={20} color="white" />
                        <label>Institutional CGPA</label>
                    </div>
                    <div className="stat-body">
                        <h4 className="value">{student?.cgpa || '0.00'}</h4>
                        <div className="decoration"><Target size={80} /></div>
                    </div>
                </div>

                {/* Semester Card */}
                <div className="stat-card crystal-dark animate-fade-in delay-1">
                    <div className="stat-meta">
                        <Calendar size={20} color="white" />
                        <label>Active Term</label>
                    </div>
                    <div className="stat-body">
                        <h4 className="value">{student?.semester || '1st'} Sem</h4>
                    </div>
                </div>

                {/* Section Card */}
                <div className="stat-card crystal-accent animate-fade-in delay-2">
                    <div className="stat-meta">
                        <Hash size={20} color="white" />
                        <label>Registry Section</label>
                    </div>
                    <div className="stat-body">
                        <h4 className="value">Section {student?.section || 'A'}</h4>
                    </div>
                </div>
            </div>

            <div className="academic-panels">
                <div className="merit-card glass-panel">
                    <h3 className="panel-heading"><ClipboardList size={18} color="var(--primary)" /> Academic Record Sheet</h3>
                    {loading ? (
                        <div className="panel-loader">Decrypting grade certificates...</div>
                    ) : (
                        <div className="registry-list">
                            {grades.map((g, idx) => (
                                <div key={idx} className="registry-item">
                                    <div className="item-main">
                                        <div className="course-title">{g.courseName}</div>
                                        <div className="score-breakdown">
                                            <span>Internal: {g.marks?.INTERNAL || 0}</span>
                                            <span className="divider">|</span>
                                            <span>Semester: {g.marks?.SEMESTER || 0}</span>
                                        </div>
                                    </div>
                                    <div className="item-score">
                                        <span className="current">{g.totalScore}</span>
                                        <span className="max">/ {g.totalMax}</span>
                                    </div>
                                </div>
                            ))}
                            {grades.length === 0 && (
                                <div className="empty-registry">No academic records categorized yet.</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="merit-card glass-panel">
                    <h3 className="panel-heading"><Book size={18} color="var(--primary)" /> Term Progress Metrics</h3>
                    <div className="progress-stack">
                        <div className="progress-group">
                            <div className="group-header">
                                <span>Curriculum Coverage</span>
                                <span className="percentage">65%</span>
                            </div>
                            <div className="progress-track"><div className="progress-fill" style={{ width: '65%' }}></div></div>
                        </div>
                        <div className="progress-group">
                            <div className="group-header">
                                <span>Credit Units Secured</span>
                                <span className="percentage">18 / 24</span>
                            </div>
                            <div className="progress-track"><div className="progress-fill accent" style={{ width: '75%' }}></div></div>
                        </div>
                    </div>
                    <div className="merit-footer">
                        <p>Academic performance is monitored by institutional AI protocols.</p>
                    </div>
                </div>
            </div>

            <style>{`
                .academic-module-container { display: flex; flex-direction: column; gap: 24px; }
                .merit-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                
                .stat-card {
                    padding: 24px;
                    border-radius: 20px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .crystal-primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.4); }
                .crystal-dark { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid rgba(255,255,255,0.1); }
                .crystal-accent { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); box-shadow: 0 12px 24px -8px rgba(124, 58, 237, 0.4); }

                .stat-meta { display: flex; align-items: center; gap: 10px; opacity: 0.9; }
                .stat-meta label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .stat-body { position: relative; z-index: 1; }
                .stat-body .value { margin: 0; font-size: 28px; font-weight: 900; }
                .stat-body .decoration { position: absolute; right: -20px; bottom: -20px; opacity: 0.15; transform: rotate(-15deg); pointer-events: none; }

                .academic-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .merit-card { padding: 28px; }
                .panel-heading { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 800; margin: 0 0 24px; color: var(--text-main); }

                .registry-list { display: flex; flex-direction: column; gap: 16px; }
                .registry-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 16px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--border-glass);
                }
                .course-title { font-size: 14px; font-weight: 800; color: var(--text-main); }
                .score-breakdown { font-size: 11px; color: var(--text-dim); font-weight: 700; margin-top: 4px; display: flex; gap: 8px; }
                .score-breakdown .divider { opacity: 0.2; }
                
                .item-score { display: flex; align-items: baseline; gap: 4px; }
                .item-score .current { font-size: 16px; font-weight: 900; color: var(--primary); }
                .item-score .max { font-size: 11px; color: var(--text-muted); font-weight: 700; }

                .progress-stack { display: flex; flex-direction: column; gap: 20px; }
                .progress-group { display: flex; flex-direction: column; gap: 10px; }
                .group-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text-dim); }
                .percentage { color: var(--text-main); font-weight: 800; }
                
                .progress-track { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; background: var(--primary); border-radius: 10px; }
                .progress-fill.accent { background: var(--accent); }

                .merit-footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-glass); }
                .merit-footer p { font-size: 11px; color: var(--text-muted); font-weight: 600; font-style: italic; margin: 0; }

                .panel-loader, .empty-registry { font-size: 13px; color: var(--text-dim); font-weight: 600; text-align: center; padding: 20px; }
            `}</style>
        </div>
    );
};

export default AcademicModule;
