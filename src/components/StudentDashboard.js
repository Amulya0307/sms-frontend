import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { User, LogOut, GraduationCap, Mail, Building, Hash, Calendar, Phone, ShieldCheck, Sparkles, ExternalLink, LayoutDashboard, Bookmark } from 'lucide-react';
import API from '../api';
import ChangePassword from './ChangePassword';
import AcademicModule from './AcademicModule';
import AttendanceModule from './AttendanceModule';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'profile');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab('profile');
        }
    }, [tab]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        navigate(`/student/${newTab}`);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await API.get('/students/me');
                setStudent(res.data);
            } catch (err) {
                console.error("Fetch Data Error:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('user');
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="animate-pulse" style={{ color: 'var(--primary)', fontSize: '16px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Synchronizing Scholastic Profile...
            </div>
        </div>
    );

    return (
        <div className="student-dashboard-layout">
            {/* Command Sidebar */}
            <aside className="dashboard-sidebar glass-panel animate-entrance">
                <div className="brand-section">
                    <div className="brand-icon"><GraduationCap size={24} color="white" /></div>
                    <span className="brand-name">Nexus SIS</span>
                </div>
                
                <nav className="nav-menu">
                    <button 
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''} animate-entrance delay-1`}
                        onClick={() => handleTabChange('profile')}
                    >
                        <User size={20} /> 
                        <span>Scholar Profile</span>
                    </button>
                    <button 
                        className={`nav-link ${activeTab === 'academics' ? 'active' : ''} animate-entrance delay-2`}
                        onClick={() => handleTabChange('academics')}
                    >
                        <Bookmark size={20} /> 
                        <span>Academic Merit</span>
                    </button>
                    <button 
                        className={`nav-link ${activeTab === 'attendance' ? 'active' : ''} animate-entrance delay-3`}
                        onClick={() => handleTabChange('attendance')}
                    >
                        <Calendar size={20} /> 
                        <span>Term Presence</span>
                    </button>
                    <button 
                        className={`nav-link ${activeTab === 'security' ? 'active' : ''} animate-entrance delay-4`}
                        onClick={() => handleTabChange('security')}
                    >
                        <ShieldCheck size={20} /> 
                        <span>Vault Access</span>
                    </button>
                </nav>
                
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn animate-entrance delay-4">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>
            
            {/* Main Content Workspace */}
            <main className="dashboard-main">
                <header className="main-header animate-entrance">
                    <div className="header-context">
                        <p className="system-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <h1 className="page-title">Scholar Command Center</h1>
                    </div>

                    <div className="header-meta">
                        <button className="meta-icon-btn"><Sparkles size={18} /></button>
                        <div className="scholar-identity">
                            <span className="rank-label">Scholar</span>
                            <div className="identity-avatar">{student?.name?.[0].toUpperCase()}</div>
                        </div>
                    </div>
                </header>
                
                <div className="content-viewport animate-slide-up">
                    {activeTab === 'profile' ? (
                        <div className="module-view profile-perspective">
                            {/* Hero Card */}
                            <div className="profile-hero-card glass-panel">
                                <div className="hero-identity">
                                    <div className="hero-avatar">
                                        <User size={48} color="var(--primary)" />
                                        <div className="online-pulse"></div>
                                    </div>
                                    <div className="hero-text">
                                        <h2 className="scholar-name">{student?.name}</h2>
                                        <div className="id-pill">
                                            <ShieldCheck size={14} /> <span>Registry Verified Scholar</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="hero-stats">
                                    <div className="stat">
                                        <label>Course Major</label>
                                        <p>{student?.department || 'Registry Pending'}</p>
                                    </div>
                                    <div className="stat">
                                        <label>Current Term</label>
                                        <p>{student?.year || '1st'} Year</p>
                                    </div>
                                    <div className="stat">
                                        <label>Permanent ID</label>
                                        <p>{student?.rollNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="profile-info-grid">
                                <div className="profile-info-card glass-panel">
                                    <h3 className="card-heading"><Mail size={18} color="var(--primary)" /> Reachability</h3>
                                    <div className="metric-list">
                                        <div className="metric-item">
                                            <div className="metric-icon"><Mail size={16} /></div>
                                            <div className="metric-details">
                                                <label>Registry Email</label>
                                                <p>{student?.email}</p>
                                            </div>
                                        </div>
                                        <div className="metric-item">
                                            <div className="metric-icon"><Phone size={16} /></div>
                                            <div className="metric-details">
                                                <label>Contact Link</label>
                                                <p>{student?.phone || 'Not Synchronized'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-info-card glass-panel">
                                    <h3 className="card-heading"><Building size={18} color="var(--primary)" /> Institutional Meta</h3>
                                    <div className="metric-list">
                                        <div className="metric-item">
                                            <div className="metric-icon"><Hash size={16} /></div>
                                            <div className="metric-details">
                                                <label>Sequence Code</label>
                                                <p>{student?.rollNumber}</p>
                                            </div>
                                        </div>
                                        <div className="metric-item">
                                            <div className="metric-icon"><LayoutDashboard size={16} /></div>
                                            <div className="metric-details">
                                                <label>Academic Batch</label>
                                                <p>{student?.year || 'Current'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="perspective-action-card glass-panel">
                                <div className="action-text">
                                    <h3>Intelligence Synchronization</h3>
                                    <p>Refine your digital identity and contact protocols within the registry.</p>
                                </div>
                                <Link to="/edit-profile" className="primary-button action-btn">
                                    Edit Profile <ExternalLink size={16} />
                                </Link>
                            </div>
                        </div>
                    ) : activeTab === 'academics' ? (
                        <AcademicModule student={student} />
                    ) : activeTab === 'attendance' ? (
                        <AttendanceModule />
                    ) : (
                        <div className="security-aspect">
                            <div className="glass-panel" style={{ padding: '40px' }}>
                                <ChangePassword />
                            </div>
                        </div>
                    )}
                    
                    <footer className="footer-label">
                         NEXUS SIS INFRASTRUCTURE • SECURE SCHOLAR INTERFACE • v4.2.0
                    </footer>
                </div>
            </main>

            <style>{`
                .student-dashboard-layout {
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

                .dashboard-main { 
                    flex: 1; 
                    display: flex; 
                    flex-direction: column; 
                    overflow: hidden; 
                    padding: 10px 0; 
                }
                .main-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 32px; 
                    flex-shrink: 0;
                }
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

                .scholar-identity {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 6px 6px 6px 16px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 30px;
                    border: 1px solid var(--border-glass);
                }
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
                .profile-perspective { display: flex; flex-direction: column; gap: 24px; }

                .profile-hero-card { padding: 32px; display: flex; justify-content: space-between; align-items: center; border-radius: 20px; }
                .hero-identity { display: flex; align-items: center; gap: 24px; }
                .hero-avatar {
                    width: 80px;
                    height: 80px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .online-pulse {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    background: var(--accent);
                    border-radius: 50%;
                    border: 3px solid #000;
                }
                .scholar-name { margin: 0; font-size: 24px; font-weight: 900; }
                .id-pill {
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 12px;
                    background: rgba(5, 150, 105, 0.1);
                    color: var(--accent);
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .hero-stats { display: flex; gap: 40px; }
                .stat { display: flex; flex-direction: column; gap: 4px; }
                .stat label { font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; }
                .stat p { margin: 0; font-size: 15px; font-weight: 700; color: var(--text-main); }

                .profile-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .profile-info-card { padding: 28px; }
                .card-heading { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 800; margin: 0 0 24px; }
                
                .metric-list { display: flex; flex-direction: column; gap: 20px; }
                .metric-item { display: flex; align-items: center; gap: 16px; }
                .metric-icon {
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-dim);
                }
                .metric-details label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
                .metric-details p { margin: 2px 0 0; font-size: 14px; font-weight: 700; }

                .perspective-action-card { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
                .action-text h3 { margin: 0; font-size: 18px; font-weight: 800; }
                .action-text p { margin: 4px 0 0; color: var(--text-dim); font-size: 13px; font-weight: 600; }

                .action-btn { padding: 12px 24px; font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 10px; }

                .security-aspect { max-width: 600px; margin: 0 auto; }

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
                    .profile-info-grid { grid-template-columns: 1fr; }
                    .hero-stats { display: none; }
                }
            `}</style>
        </div>
    );
};

export default StudentDashboard;