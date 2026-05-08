import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import API from '../api';

const ChangePassword = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return alert("Security Alert: Access keys do not match.");
        }
        
        setLoading(true);
        try {
            await API.post('/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setSuccess(true);
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            alert(err.response?.data?.message || "Security Alert: Access update synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="security-mgr-container">
            <div className="mgr-header">
                <div className="mgr-icon-box"><Shield size={24} color="var(--primary)" /></div>
                <div className="mgr-title-group">
                    <h2 className="mgr-title">Access Synchronization</h2>
                    <p className="mgr-subtitle">Update and verify your institutional security credentials.</p>
                </div>
            </div>

            <div className="security-card-wrapper animate-slide-up">
                <div className="mgr-card glass-panel">
                    {success && (
                        <div className="status-banner success animate-entrance">
                            <CheckCircle2 size={18} /> Credentials successfully synchronized!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mgr-form">
                        <div className="form-group">
                            <label>Legacy Access Token</label>
                            <div className="input-wrapper">
                                <Key size={16} className="input-icon" />
                                <input 
                                    type={showPw ? "text" : "password"} className="input-field" 
                                    placeholder="Enter current password"
                                    required
                                    value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-divider"></div>

                        <div className="form-group">
                            <label>New Security Key</label>
                            <div className="input-wrapper">
                                <input 
                                    type={showPw ? "text" : "password"} className="input-field" 
                                    placeholder="Define new access key"
                                    required
                                    value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="toggle-btn" aria-label="Toggle visibility">
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Security Key</label>
                            <div className="input-wrapper">
                                <input 
                                    type={showPw ? "text" : "password"} className="input-field" 
                                    placeholder="Verify new access key"
                                    required
                                    value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>

                        <button type="submit" className="primary-button submit-action" disabled={loading}>
                            {loading ? 'Processing encryption...' : (
                                <>
                                    Commit Security Update <Save size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .security-mgr-container {
                    max-width: 600px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .mgr-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    border-bottom: 1px solid var(--border-glass);
                    padding-bottom: 24px;
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

                .mgr-card { padding: 40px; }
                
                .status-banner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    border-radius: 12px;
                    margin-bottom: 32px;
                    font-size: 14px;
                    font-weight: 700;
                    border: 1px solid transparent;
                }
                .status-banner.success {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--accent);
                    border-color: rgba(16, 185, 129, 0.2);
                }

                .mgr-form { display: flex; flex-direction: column; gap: 24px; }
                .form-group { display: flex; flex-direction: column; gap: 10px; }
                .form-group label { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-left: 4px; }
                
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 16px; color: var(--text-dim); z-index: 1; }
                .mgr-form .input-field { padding-left: 48px; }
                
                .toggle-btn {
                    position: absolute;
                    right: 14px;
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    z-index: 1;
                    padding: 8px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                }
                .toggle-btn:hover { color: var(--text-main); }

                .form-divider {
                    height: 1px;
                    background: var(--border-glass);
                    margin: 8px 0;
                }

                .submit-action {
                    margin-top: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
};

export default ChangePassword;
