import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';
import API from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await API.post('/auth/forgot-password', { email });
            setMessage({ type: 'success', text: 'Reset token generated! Check server console.' });
            setTimeout(() => navigate('/reset-password'), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Email not found.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.glassCard} className="animate-slide-up glass-panel">
                <div style={styles.header}>
                    <Link to="/" style={styles.backBtn}><ArrowLeft size={18} /> Back</Link>
                    <h2 style={styles.title}>Recovery</h2>
                    <p style={styles.subtitle}>Enter your registered email to receive a password reset token.</p>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <Mail size={18} color="var(--text-muted)" style={styles.inputIcon} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="input-field"
                            style={styles.inputCustom}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="primary-button" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Sending Request...' : <><Send size={18} /> Get Reset Token</>}
                    </button>
                    
                    {message.text && (
                        <div style={{
                            ...styles.message, 
                            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                            color: message.type === 'success' ? '#10b981' : '#f87171',
                            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}>
                            {message.text}
                            {message.type === 'success' && (
                                <button 
                                    onClick={() => navigate('/reset-password')}
                                    style={styles.proceedBtn}
                                >
                                    Proceed to Reset <Sparkles size={14} />
                                </button>
                            )}
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
    submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', fontSize: '16px' },
    message: { padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '10px' },
    proceedBtn: { background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }
};

export default ForgotPassword;
