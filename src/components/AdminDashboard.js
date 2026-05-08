import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, LogOut, UserPlus, Shield, ChevronRight, BookOpen, UserCheck, Calendar, LayoutGrid } from 'lucide-react';
import StudentList from './StudentList';
import AddStudent from './AddStudent';
import DashboardStats from './DashboardStats';
import ChangePassword from './ChangePassword';
import CourseManager from './CourseManager';
import EnrollmentManager from './EnrollmentManager';
import AttendanceManager from './AttendanceManager';
import AdminFacultyManager from './AdminFacultyManager';
import ManagementHub from './ManagementHub';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'overview');
    
    React.useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab('overview');
        }
    }, [tab]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        navigate(`/admin-dashboard/${newTab}`);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { id: 'overview', label: 'System Overview', icon: LayoutGrid },
        { id: 'management', label: 'Management Hub', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const getPageTitle = () => {
        const item = navItems.find(i => i.id === activeTab);
        return item ? item.label : 'Dashboard';
    };

    return (
        <div className="dashboard-container">
            <div className="mesh-gradient">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div className="blob blob-4"></div>
            </div>

            {/* Premium Integrated Sidebar */}
            <aside className="dashboard-sidebar glass-panel animate-entrance">
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <LayoutGrid size={24} color="white" />
                    </div>
                    <span className="brand-name">SMS Pro</span>
                </div>
                
                <nav className="sidebar-nav">
                    {navItems.map((item, index) => (
                        <button 
                            key={item.id}
                            className={`nav-item animate-entrance delay-${(index % 4) + 1} ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(item.id)}
                        >
                            <item.icon size={18} className="nav-icon" /> 
                            <span className="nav-label">{item.label}</span>
                            {activeTab === item.id && <ChevronRight size={14} className="active-chevron" />}
                        </button>
                    ))}
                </nav>
                
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">AD</div>
                        <div className="user-details">
                            <span className="user-name">Administrator</span>
                            <span className="user-role">Super User</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="dashboard-main">
                <header className="dashboard-header animate-entrance">
                    <div className="header-left">
                        <span className="breadcrumb">System / {getPageTitle()}</span>
                        <h1 className="header-title">{getPageTitle()}</h1>
                    </div>

                    <div className="header-right">
                        <div className="header-date">
                            <Calendar size={14} />
                            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                    </div>
                </header>
                
                <div className="dashboard-scrollable">
                    <div className="content-inner animate-entrance delay-1">
                        {activeTab === 'overview' ? (
                            <div className="view-stack">
                                <DashboardStats />
                                <div className="data-card glass-panel">
                                    <div className="welcome-hero">
                                        <h2>Welcome back, Administrator</h2>
                                        <p>System is operational. All services are currently running within normal parameters.</p>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'management' ? (
                            <ManagementHub />
                        ) : activeTab === 'attendance' ? (
                            <div className="data-card glass-panel">
                                <AttendanceManager />
                            </div>
                        ) : (
                            <div className="compact-form glass-panel">
                                <ChangePassword />
                            </div>
                        )}
                    </div>
                    
                    <footer className="dashboard-footer">
                        <span className="version-tag">SMS DARK EDITION • v3.0.0</span>
                    </footer>
                </div>
            </main>

            <style>{`
                .dashboard-container {
                    display: flex;
                    height: 100vh;
                    width: 100vw;
                    background: var(--bg-main);
                    padding: 24px;
                    gap: 24px;
                    overflow: hidden;
                    color: var(--text-main);
                }

                .dashboard-sidebar {
                    width: 280px;
                    display: flex;
                    flex-direction: column;
                    padding: 32px 16px;
                    border: 1px solid var(--border-glass);
                }

                .sidebar-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 12px;
                    margin-bottom: 40px;
                }

                .brand-logo {
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 16px var(--primary-glow);
                }

                .brand-name {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    flex: 1;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.3s;
                    text-align: left;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-main);
                }

                .nav-item.active {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.2);
                    color: var(--primary);
                }

                .nav-label {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                }

                .sidebar-footer {
                    margin-top: auto;
                    padding-top: 24px;
                    border-top: 1px solid var(--border-glass);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 12px;
                }

                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 800;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                }

                .user-name {
                    font-size: 14px;
                    font-weight: 700;
                }

                .user-role {
                    font-size: 11px;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .logout-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .logout-button:hover {
                    background: rgba(239, 68, 68, 0.2);
                    transform: translateY(-1px);
                }

                .dashboard-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    overflow: hidden;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                }

                .breadcrumb {
                    font-size: 12px;
                    color: var(--text-dim);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .header-title {
                    font-size: 32px;
                    margin: 4px 0 0;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .header-date {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                    border: 1px solid var(--border-glass);
                }

                .notification-bell {
                    position: relative;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--text-muted);
                    transition: all 0.3s;
                }

                .notification-bell:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: var(--text-main);
                }

                .ping {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 8px;
                    height: 8px;
                    background: var(--danger);
                    border-radius: 50%;
                    border: 2px solid var(--bg-main);
                }

                .dashboard-scrollable {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .content-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    min-height: 100%;
                }

                .view-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .data-card {
                    padding: 32px;
                    min-height: 400px;
                }

                .centered-form {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                }

                .compact-form {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 40px;
                }

                .dashboard-footer {
                    margin-top: 48px;
                    padding: 24px 0;
                    text-align: center;
                    border-top: 1px solid var(--border-glass);
                }

                .version-tag {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-dim);
                    letter-spacing: 0.2em;
                }

                .welcome-hero {
                    padding: 40px;
                    text-align: center;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }

                .welcome-hero h2 {
                    font-size: 28px;
                    margin: 0;
                    background: linear-gradient(to right, #fff, var(--text-dim));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .welcome-hero p {
                    margin: 12px 0 0;
                    color: var(--text-dim);
                    font-size: 16px;
                }

                /* Custom Scrollbar for Dark Theme */
                .dashboard-scrollable::-webkit-scrollbar {
                    width: 6px;
                }
                .dashboard-scrollable::-webkit-scrollbar-track {
                    background: transparent;
                }
                .dashboard-scrollable::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .dashboard-scrollable::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;