import React, { useState } from 'react';
import { Users, Shield, BookOpen, UserCheck, Plus, List } from 'lucide-react';
import StudentList from './StudentList';
import AddStudent from './AddStudent';
import AdminFacultyManager from './AdminFacultyManager';
import CourseManager from './CourseManager';
import EnrollmentManager from './EnrollmentManager';

const ManagementHub = () => {
    const [subTab, setSubTab] = useState('students');
    const [showAddForm, setShowAddForm] = useState(false);

    const subNavItems = [
        { id: 'students', label: 'Students', icon: Users },
        { id: 'faculty', label: 'Faculty', icon: Shield },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'enrollment', label: 'Enrollments', icon: UserCheck },
    ];

    return (
        <div className="hub-container animate-entrance">
            {/* Horizontal Sub-Navigation */}
            <div className="hub-nav glass-panel">
                {subNavItems.map((item) => (
                    <button
                        key={item.id}
                        className={`hub-nav-item ${subTab === item.id ? 'active' : ''}`}
                        onClick={() => {
                            setSubTab(item.id);
                            setShowAddForm(false);
                        }}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Dynamic Content Area */}
            <div className="hub-content">
                {subTab === 'students' ? (
                    <div className="hub-view-stack">
                        <div className="hub-header">
                            <div className="hub-title-group">
                                <h2>Student Administration</h2>
                                <p>Manage registry, enrollment data and student profiles</p>
                            </div>
                            <button 
                                className="hub-action-btn"
                                onClick={() => setShowAddForm(!showAddForm)}
                            >
                                {showAddForm ? <><List size={18} /> View List</> : <><Plus size={18} /> Add Student</>}
                            </button>
                        </div>
                        
                        <div className="hub-main-area animate-entrance">
                            {showAddForm ? (
                                <div className="centered-content">
                                    <AddStudent onSaved={() => setShowAddForm(false)} />
                                </div>
                            ) : (
                                <div className="data-card glass-panel">
                                    <StudentList />
                                </div>
                            )}
                        </div>
                    </div>
                ) : subTab === 'faculty' ? (
                    <div className="hub-view-stack animate-entrance">
                        <div className="hub-header">
                            <div className="hub-title-group">
                                <h2>Faculty Management</h2>
                                <p>Control personnel records and department assignments</p>
                            </div>
                        </div>
                        <div className="data-card glass-panel">
                            <AdminFacultyManager />
                        </div>
                    </div>
                ) : subTab === 'courses' ? (
                    <div className="hub-view-stack animate-entrance">
                        <div className="hub-header">
                            <div className="hub-title-group">
                                <h2>Academic Catalog</h2>
                                <p>Configure available courses and credit systems</p>
                            </div>
                        </div>
                        <div className="data-card glass-panel">
                            <CourseManager />
                        </div>
                    </div>
                ) : (
                    <div className="hub-view-stack animate-entrance">
                        <div className="hub-header">
                            <div className="hub-title-group">
                                <h2>Enrollment Control</h2>
                                <p>Manage the mapping between students and academic units</p>
                            </div>
                        </div>
                        <div className="data-card glass-panel">
                            <EnrollmentManager />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .hub-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    width: 100%;
                }

                .hub-nav {
                    display: flex;
                    padding: 8px;
                    gap: 8px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.02);
                }

                .hub-nav-item {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 14px;
                    border-radius: 12px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .hub-nav-item:hover {
                    color: var(--text-main);
                    background: rgba(255, 255, 255, 0.05);
                }

                .hub-nav-item.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 8px 16px var(--primary-glow);
                }

                .hub-content {
                    min-height: 500px;
                }

                .hub-view-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .hub-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .hub-title-group h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 800;
                }

                .hub-title-group p {
                    margin: 8px 0 0;
                    color: var(--text-dim);
                    font-size: 14px;
                }

                .hub-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 24px;
                    border-radius: 12px;
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: var(--primary);
                    font-weight: 800;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .hub-action-btn:hover {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
                    transform: translateY(-2px);
                }

                .centered-content {
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 24px;
                    border: 1px solid var(--border-glass);
                }
            `}</style>
        </div>
    );
};

export default ManagementHub;
