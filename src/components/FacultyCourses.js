import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, Award, Search, Sparkles } from 'lucide-react';
import API from '../api';

const FacultyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get('/courses/my-courses');
                setCourses(res.data || []);
            } catch (err) {
                console.error("Error fetching subjects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="faculty-courses-container">
            <header className="courses-header">
                <div className="header-identity">
                    <div className="identity-icon"><BookOpen size={24} color="var(--primary)" /></div>
                    <div className="identity-text">
                        <h2 className="title">Academic Portfolio</h2>
                        <p className="subtitle">Subjects currently under your instructional authority.</p>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="courses-loader">
                    <Sparkles size={32} className="animate-pulse" />
                    <span>Synchronizing subject registries...</span>
                </div>
            ) : courses.length > 0 ? (
                <div className="courses-grid animate-slide-up">
                    {courses.map(course => (
                        <div key={course.id} className="course-card glass-panel">
                            <div className="card-top">
                                <span className="dept-badge">{course.department}</span>
                                <span className="credits-badge">{course.credits} Credits</span>
                            </div>
                            <h3 className="course-name">{course.courseName}</h3>
                            <p className="course-code">{course.courseCode}</p>
                            
                            <div className="card-footer">
                                <div className="footer-item">
                                    <MapPin size={14} className="icon" />
                                    <span>Main Campus</span>
                                </div>
                                <div className="footer-item">
                                    <Award size={14} className="icon" />
                                    <span>Core Metric</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="courses-empty glass-panel animate-fade-in">
                    <Search size={48} color="var(--text-dim)" strokeWidth={1} />
                    <h3>No subjects mapped</h3>
                    <p>Contact the administrator to synchronize your instructional schedule with this identity.</p>
                </div>
            )}

            <style>{`
                .faculty-courses-container { display: flex; flex-direction: column; gap: 32px; }
                
                .courses-header { padding-bottom: 32px; border-bottom: 1px solid var(--border-glass); }
                .header-identity { display: flex; gap: 20px; alignItems: center; }
                .identity-icon { background: rgba(59, 130, 246, 0.05); padding: 16px; border-radius: 18px; border: 1px solid var(--border-glass); }
                .identity-text .title { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-main); }
                .identity-text .subtitle { margin: 4px 0 0; color: var(--text-dim); font-size: 14px; font-weight: 600; }

                .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
                .course-card { padding: 28px; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid var(--border-glass); }
                .course-card:hover { transform: translateY(-4px); border-color: rgba(59, 130, 246, 0.3); }

                .card-top { display: flex; justifyContent: space-between; margin-bottom: 20px; }
                .dept-badge { padding: 4px 12px; background: rgba(59, 130, 246, 0.1); color: var(--primary); border-radius: 30px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
                .credits-badge { padding: 4px 12px; background: rgba(255, 255, 255, 0.03); color: var(--text-dim); border-radius: 30px; font-size: 10px; font-weight: 800; border: 1px solid var(--border-glass); }
                
                .course-name { margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: var(--text-main); }
                .course-code { margin: 0 0 24px 0; color: var(--primary); font-weight: 700; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; }
                
                .card-footer { display: flex; gap: 20px; border-top: 1px solid var(--border-glass); paddingTop: 20px; }
                .footer-item { display: flex; alignItems: center; gap: 8px; color: var(--text-muted); font-size: 12px; font-weight: 600; }
                .footer-item .icon { color: var(--text-dim); }

                .courses-loader { padding: 80px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--primary); font-weight: 800; font-size: 14px; }
                .courses-empty { padding: 80px 40px; display: flex; flex-direction: column; align-items: center; textAlign: center; gap: 12px; }
                .courses-empty h3 { margin: 12px 0 0; color: var(--text-main); font-size: 20px; font-weight: 800; }
                .courses-empty p { margin: 0; color: var(--text-dim); font-size: 14px; font-weight: 600; max-width: 400px; }
            `}</style>
        </div>
    );
};

export default FacultyCourses;
