import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, LogOut, BookOpen, Calendar, TrendingUp, Users, Sparkles } from 'lucide-react';
import AttendanceManager from './AttendanceManager';
import MarksManager from './MarksManager';
import EnrollmentManager from './EnrollmentManager';
import FacultyCourses from './FacultyCourses';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'attendance');
    
    React.useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab('attendance');
        }
    }, [tab]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        navigate(`/faculty-dashboard/${newTab}`);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { id: 'attendance', label: 'Attendance Hub', icon: Calendar },
        { id: 'marks', label: 'Grades & Assessment', icon: TrendingUp },
        { id: 'enrollment', label: 'Student Registry', icon: Users },
        { id: 'courses', label: 'Subject Portfolio', icon: BookOpen },
    ];

    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="faculty-dashboard-layout">
            {/* Faculty Peripheral Rail */}
            <aside className="dashboard-sidebar glass-panel animate-entrance">
                <div className="brand-section">
                    <div className="brand-icon"><LayoutDashboard size={24} color="white" /></div>
                    <span className="brand-name">Nexus FIS</span>
                </div>
                
                <nav className="nav-menu">
                    {navItems.map((item, index) => (
                        <button 
                            key={item.id}
                            className={`nav-link ${activeTab === item.id ? 'active' : ''} animate-entrance delay-${(index % 4) + 1}`}
                            onClick={() => handleTabChange(item.id)}
                        >
                            <item.icon size={20} /> 
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn animate-entrance delay-4">
                        <LogOut size={18} /> Resign Session
                    </button>
                </div>
            </aside>
            
            {/* Main Command Workspace */}
            <main className="dashboard-main">
                <header className="main-header animate-entrance">
                    <div className="header-context">
                        <p className="system-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <h1 className="page-title">Faculty Perspective</h1>
                    </div>

                    <div className="header-meta">
                        
                        <div className="educator-identity clickable" onClick={() => navigate('/faculty-profile')}>
                            <span className="rank-label">Educator</span>
                            <div className="identity-avatar">{userData.username?.[0].toUpperCase() || 'F'}</div>
                        </div>
                    </div>
                </header>
                
                <div className="content-viewport animate-slide-up">
                    <div className="active-sector">
                        {activeTab === 'attendance' ? (
                            <div className="module-frame">
                                <AttendanceManager />
                            </div>
                        ) : activeTab === 'marks' ? (
                            <div className="module-frame">
                                <MarksManager />
                            </div>
                        ) : activeTab === 'enrollment' ? (
                            <div className="module-frame">
                                <EnrollmentManager />
                            </div>
                        ) : activeTab === 'courses' ? (
                            <div className="module-frame">
                                <FacultyCourses />
                            </div>
                        ) : (
                            <div className="glass-panel sector-loader">
                                <Sparkles size={40} className="animate-pulse" />
                                <h2>Initializing Sector Protocol...</h2>
                                <p>Synchronizing architectural dependencies for this module.</p>
                            </div>
                        )}
                    </div>
                    
                    <footer className="footer-label">
                         NEXUS FIS ARCHITECTURE • v2.4.0 • ACADEMIC CORE INFRASTRUCTURE
                    </footer>
                </div>
            </main>

            <style>{`
                .faculty-dashboard-layout {
                    display: flex;
                    height: 100vh;
                    width: 100vw;
                    padding: 24px;
                    gap: 24px;
                    overflow: hidden;
                }

                .dashboard-sidebar {
                    width: 280px;
                    padding: 32px 20px;
                    display: flex;
                    flex-direction: column;
                    border-radius: 24px;
                }

                .brand-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 12px;
                    margin-bottom: 40px;
                }

                .brand-icon {
                    width: 44px;
                    height: 44px;
                    background: var(--primary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
                }

                .brand-name { font-size: 20px; font-weight: 900; letter-spacing: -0.02em; }

                .nav-menu { display: flex; flex-direction: column; gap: 8px; flex: 1; }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 14px;
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--text-dim);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nav-link:hover { background: rgba(255, 255, 255, 0.03); color: var(--text-main); }
                .nav-link.active {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.2);
                    color: var(--primary);
                }

                .sidebar-footer { margin-top: auto; }
                .logout-btn {
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    background: rgba(244, 63, 94, 0.05);
                    border: 1px solid rgba(244, 63, 94, 0.1);
                    color: var(--danger);
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .logout-btn:hover { background: rgba(244, 63, 94, 0.1); }

                .dashboard-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 10px 0; }
                .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
                .system-date { color: var(--text-muted); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px; }
                .page-title { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }

                .header-meta { display: flex; align-items: center; gap: 20px; }
                .meta-icon-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .educator-identity {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 6px 6px 6px 16px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 30px;
                    border: 1px solid var(--border-glass);
                    transition: all 0.2s;
                }
                .educator-identity.clickable { cursor: pointer; }
                .educator-identity.clickable:hover { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); }
                .rank-label { font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
                .identity-avatar {
                    width: 32px;
                    height: 32px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 14px;
                }

                .content-viewport { flex: 1; overflow-y: auto; padding-right: 8px; }
                .module-frame { display: flex; flex-direction: column; gap: 24px; padding: 32px; border-radius: 24px; background: rgba(255,255,255,0.01); border: 1px solid var(--border-glass); }

                .sector-loader { padding: 100px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 400px; }
                .sector-loader h2 { margin: 0; font-size: 24px; font-weight: 800; }
                .sector-loader p { margin: 0; color: var(--text-dim); font-weight: 600; }

                .footer-label {
                    margin-top: 40px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    padding-bottom: 24px;
                    opacity: 0.5;
                }

                @media (max-width: 1024px) {
                    .dashboard-sidebar { display: none; }
                }
            `}</style>
        </div>
    );
};

export default FacultyDashboard;
