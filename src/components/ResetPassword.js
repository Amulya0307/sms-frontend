import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import API from '../api';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ token: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match.' });
        }
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await API.post('/auth/reset-password', { 
                token: formData.token, 
                newPassword: formData.newPassword 
            });
            setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid or expired token.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.glassCard} className="animate-slide-up glass-panel">
                <div style={styles.header}>
                    <Link to="/" style={styles.backBtn}><ArrowLeft size={18} /> Cancel</Link>
                    <h2 style={styles.title}>New Password</h2>
                    <p style={styles.subtitle}>Enter the token from the console (or 'admin' for the admin account) and your new credentials.</p>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <KeyRound size={18} color="var(--text-muted)" style={styles.inputIcon} />
                        <input 
                            type="text" 
                            placeholder="Reset Token" 
                            className="input-field"
                            style={styles.inputCustom}
                            value={formData.token}
                            onChange={(e) => setFormData({...formData, token: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <Lock size={18} color="var(--text-muted)" style={styles.inputIcon} />
                        <input 
                            type="password" 
                            placeholder="New Secure Password" 
                            className="input-field"
                            style={styles.inputCustom}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <CheckCircle size={18} color="var(--text-muted)" style={styles.inputIcon} />
                        <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            className="input-field"
                            style={styles.inputCustom}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="primary-button" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Updating Credentials...' : 'Set New Password'}
                    </button>
                    
                    {message.text && (
                        <div style={{
                            ...styles.message, 
                            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                            color: message.type === 'success' ? '#10b981' : '#f87171',
                            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-deep)' },
    glassCard: { width: '100%', maxWidth: '440px', padding: '48px 40px' },
    header: { marginBottom: '32px' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-dim)', fontSize: '14px', marginBottom: '16px', fontWeight: '600' },
    title: { margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700', color: '#fff' },
    subtitle: { color: 'var(--text-muted)', fontSize: '15px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' },
    inputCustom: { width: '100%', paddingLeft: '48px' },
    submitBtn: { padding: '16px', fontSize: '16px', marginTop: '10px' },
    message: { padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '14px', textAlign: 'center', marginTop: '10px' }
};

export default ResetPassword;
