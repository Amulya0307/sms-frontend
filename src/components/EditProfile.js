import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Save, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../api';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await API.get('/students/me');
                setFormData({
                    name: res.data.name,
                    rollNumber: res.data.rollNumber,
                    email: res.data.email,
                    phone: res.data.phone || ''
                });
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            await API.put('/students/me', {
                email: formData.email,
                phone: formData.phone
            });
            setMessage({ type: 'success', text: 'Profile intelligence updated successfully!' });
            setTimeout(() => navigate('/student'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to synchronize record synchronization. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="profile-loader-container">
            <div className="animate-pulse loader-text">Accessing Secure Vault...</div>
            <style>{`
                .profile-loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; }
                .loader-text { color: var(--primary); font-size: 18px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
            `}</style>
        </div>
    );

    return (
        <div className="profile-refine-container">
            <div className="profile-wrapper animate-slide-up">
                <div className="refine-header">
                    <button onClick={() => navigate('/student')} className="nav-back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="header-text">
                        <h1 className="refine-title">Refine Identity</h1>
                        <p className="refine-subtitle">Update institutional contact coordinates and metadata.</p>
                    </div>
                </div>

                <div className="refine-card glass-panel">
                    <form onSubmit={handleSubmit} className="refine-form">
                        <div className="identity-pigeonhole">
                            <div className="identity-avatar">
                                <User size={40} color="var(--primary)" />
                            </div>
                            <div className="identity-meta">
                                <h2 className="profile-name">{formData.name}</h2>
                                <div className="id-badge">
                                    <ShieldCheck size={14} /> <span>ID: {formData.rollNumber}</span>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`status-banner ${message.type} animate-entrance`}>
                                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <div className="refine-field-grid">
                            <div className="form-group">
                                <label>Electronic Mail Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <p className="field-hint">Primary channel for secure synchronization and alerts.</p>
                            </div>

                            <div className="form-group">
                                <label>Telephonic Link</label>
                                <div className="input-wrapper">
                                    <Phone size={18} className="input-icon" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="input-field"
                                    />
                                </div>
                                <p className="field-hint">Secondary contact for emergency institutional reach.</p>
                            </div>
                        </div>

                        <div className="refine-footer">
                            <button 
                                type="button" 
                                onClick={() => navigate('/student')} 
                                className="cancel-action"
                                disabled={saving}
                            >
                                Terminate
                            </button>
                            <button 
                                type="submit" 
                                className="primary-button commit-action" 
                                disabled={saving}
                            >
                                {saving ? 'Synchronizing...' : (
                                    <>
                                        Commit Changes <Save size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="security-guarantee">
                    <Sparkles size={14} color="var(--primary)" />
                    <span>Records protected by institutional end-to-end encryption.</span>
                </div>
            </div>

            <style>{`
                .profile-refine-container {
                    padding: 60px 20px;
                    display: flex;
                    justify-content: center;
                }

                .profile-wrapper { width: 100%; max-width: 720px; }

                .refine-header { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
                .nav-back-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nav-back-btn:hover { background: rgba(59, 130, 246, 0.1); border-color: var(--primary); }

                .refine-title { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.04em; }
                .refine-subtitle { margin: 6px 0 0; color: var(--text-dim); font-size: 15px; font-weight: 600; }

                .refine-card { padding: 48px; }

                .identity-pigeonhole {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid var(--border-glass);
                    margin-bottom: 32px;
                }

                .identity-avatar {
                    width: 80px;
                    height: 80px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border-glass);
                }

                .profile-name { margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
                .id-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--primary);
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 800;
                    margin-top: 8px;
                    border: 1px solid var(--border-glass);
                    width: fit-content;
                }

                .status-banner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                    border-radius: 14px;
                    margin-bottom: 32px;
                    font-size: 14px;
                    font-weight: 700;
                    border: 1px solid transparent;
                }
                .status-banner.success { background: rgba(16, 185, 129, 0.1); color: var(--accent); border-color: rgba(16, 185, 129, 0.2); }
                .status-banner.error { background: rgba(244, 63, 94, 0.1); color: var(--danger); border-color: rgba(244, 63, 94, 0.2); }

                .refine-field-grid { display: flex; flex-direction: column; gap: 32px; }
                .form-group { display: flex; flex-direction: column; gap: 10px; }
                .form-group label { font-size: 12px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-left: 4px; }
                
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 16px; color: var(--text-dim); z-index: 1; }
                .refine-form .input-field { padding-left: 48px; }

                .field-hint { font-size: 12px; color: var(--text-muted); margin: 0; font-weight: 600; padding-left: 4px; }

                .refine-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 20px;
                    margin-top: 48px;
                    padding-top: 32px;
                    border-top: 1px solid var(--border-glass);
                }

                .cancel-action {
                    padding: 14px 28px;
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    font-weight: 800;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .cancel-action:hover { color: var(--danger); }

                .commit-action { padding: 14px 40px; display: flex; align-items: center; gap: 12px; min-width: 240px; }

                .security-guarantee {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 32px;
                    font-size: 13px;
                    color: var(--text-muted);
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default EditProfile;
