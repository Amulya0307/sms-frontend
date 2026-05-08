import React, { useState } from 'react';
import { Save, X, User, Mail, BookOpen, Calendar, Phone, Edit3, Sparkles, Hash } from 'lucide-react';
import API from '../api';

const EditStudent = ({ student: initialData, onSaved, onClose }) => {
    const [student, setStudent] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (student.rollNumber !== initialData.rollNumber) {
            if (!window.confirm("WARNING: Changing the Roll Number will change the student's login username. This will prevent them from logging in with their old ID. Continue?")) {
                return;
            }
        }

        setLoading(true);
        try {
            await API.put(`/students/${student.id}`, student);
            onSaved();
        } catch (err) {
            alert(err.response?.data?.message || "Data integrity error during update.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-mgr-container">
            <div className="edit-mgr-header">
                <div className="mgr-icon-box"><Edit3 size={24} color="var(--primary)" /></div>
                <div className="mgr-title-group">
                    <h2 className="mgr-title">Edit Record</h2>
                    <p className="mgr-subtitle">Updating identity for ID: <b>{student.rollNumber}</b></p>
                </div>
                <button onClick={onClose} className="mgr-close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label><User size={14} /> Full Name</label>
                        <input 
                            type="text" className="input-field" required
                            value={student.name} onChange={e => setStudent({...student, name: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Hash size={14} /> Roll Number (Username)</label>
                        <input 
                            type="text" className="input-field" required
                            value={student.rollNumber} onChange={e => setStudent({...student, rollNumber: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Mail size={14} /> Email Address</label>
                        <input 
                            type="email" className="input-field" required
                            value={student.email} onChange={e => setStudent({...student, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Phone size={14} /> Contact Number</label>
                        <input 
                            type="text" className="input-field"
                            value={student.phone || ''} onChange={e => setStudent({...student, phone: e.target.value})}
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
                            value={student.semester || '1st'} onChange={e => setStudent({...student, semester: e.target.value})}
                        >
                            <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                            <option>5th</option><option>6th</option><option>7th</option><option>8th</option>
                        </select>
                    </div>

                    <div className="form-group card-col">
                        <label><Hash size={14} /> Section</label>
                        <input 
                            type="text" className="input-field"
                            value={student.section || ''} onChange={e => setStudent({...student, section: e.target.value})}
                        />
                    </div>

                    <div className="form-group card-col">
                        <label><Sparkles size={14} /> Current CGPA</label>
                        <input 
                            type="number" step="0.01" min="0" max="10" className="input-field"
                            value={student.cgpa || 0} onChange={e => setStudent({...student, cgpa: parseFloat(e.target.value) || 0})}
                        />
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" onClick={onClose} className="cancel-link">Discard Changes</button>
                    <button type="submit" className="primary-button submit-btn" disabled={loading}>
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={18} /> Update Record
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style>{`
                .edit-mgr-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .edit-mgr-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    margin-bottom: 8px;
                    position: relative;
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
                
                .mgr-close-btn {
                    position: absolute;
                    top: 0;
                    right: -10px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .mgr-close-btn:hover { color: var(--text-main); }

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

                .full-width { grid-column: span 2; }

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

                .cancel-link:hover { color: var(--text-main); }

                .submit-btn { min-width: 200px; }

                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .full-width { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

export default EditStudent;