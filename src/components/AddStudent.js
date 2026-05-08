import React, { useState } from 'react';
import { UserPlus, Save, User, Mail, BookOpen, Calendar, Phone, Hash, Sparkles } from 'lucide-react';
import API from '../api';

const AddStudent = ({ onSaved, onCancel }) => {
    const [student, setStudent] = useState({
        name: '', 
        email: '',
        department: 'Computer Science', 
        phone: '', 
        rollNumber: '', 
        year: '1st',
        semester: '1st', 
        section: 'A', 
        
        cgpa: 0.0
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/students', student);
            onSaved();
        } catch (err) {
            alert("Record integrity alert: Roll number or email may already exist in the system.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <div className="form-icon-box"><UserPlus size={24} color="var(--primary)" /></div>
                <div className="form-title-group">
                    <h2 className="form-title">New Enrollment</h2>
                    <p className="form-subtitle">Create a new student profile in the system database.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label><User size={14} /> Full Name</label>
                        <input 
                            type="text" placeholder="John Doe" className="input-field" required
                            value={student.name} onChange={e => setStudent({...student, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label><Hash size={14} /> Roll Number</label>
                        <input 
                            type="text" placeholder="CS2026-X" className="input-field" required
                            value={student.rollNumber} onChange={e => setStudent({...student, rollNumber: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Mail size={14} /> Email Address</label>
                        <input 
                            type="email" placeholder="student@example.edu" className="input-field" required
                            value={student.email} onChange={e => setStudent({...student, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Phone size={14} /> Contact Number</label>
                        <input 
                            type="text" placeholder="+1 234 567 890" className="input-field"
                            value={student.phone} onChange={e => setStudent({...student, phone: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><BookOpen size={14} /> Department</label>
                        <select 
                            className="input-field"
                            value={student.department} onChange={e => setStudent({...student, department: e.target.value})}
                        >
                            <option>Computer Science</option>
                            <option>Mechanical</option>
                            <option>Electrical</option>
                            <option>Civil</option>
                            <option>Business</option>
                        </select>
                    </div>

                    <div className="form-group card-col">
                        <label><Calendar size={14} /> Academic Year</label>
                        <select 
                            className="input-field"
                            value={student.year} onChange={e => setStudent({...student, year: e.target.value})}
                        >
                            <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                        </select>
                    </div>

                    <div className="form-group card-col">
                        <label><BookOpen size={14} /> Semester</label>
                        <select 
                            className="input-field"
                            value={student.semester} onChange={e => setStudent({...student, semester: e.target.value})}
                        >
                            <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                            <option>5th</option><option>6th</option><option>7th</option><option>8th</option>
                        </select>
                    </div>

                    <div className="form-group card-col">
                        <label><Hash size={14} /> Section</label>
                        <input 
                            type="text" placeholder="A, B, C" className="input-field"
                            value={student.section} onChange={e => setStudent({...student, section: e.target.value})}
                        />
                    </div>

                    <div className="form-group card-col">
                        <label><Sparkles size={14} /> Initial CGPA</label>
                        <input 
                            type="number" step="0.01" min="0" max="10" placeholder="0.00" className="input-field"
                            value={student.cgpa} onChange={e => setStudent({...student, cgpa: parseFloat(e.target.value) || 0})}
                        />
                    </div>
                </div>

                <div className="form-footer">
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="cancel-link">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="primary-button submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (
                            <>
                                Enroll Student <Save size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style>{`
                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .form-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .form-icon-box {
                    width: 52px;
                    height: 52px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border-glass);
                }

                .form-title {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 800;
                }

                .form-subtitle {
                    margin: 4px 0 0;
                    color: var(--text-dim);
                    font-size: 14px;
                }

                .premium-form {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .full-width {
                    grid-column: span 2;
                }

                .card-col {
                    grid-column: span 1;
                }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-left: 4px;
                }

                .form-footer {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 24px;
                    padding-top: 24px;
                    border-top: 1px solid var(--border-glass);
                }

                .cancel-link {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .cancel-link:hover {
                    color: var(--text-main);
                }

                .submit-btn {
                    min-width: 200px;
                }

                /* Mobile Adjustment */
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    .full-width {
                        grid-column: span 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default AddStudent;