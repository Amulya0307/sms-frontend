import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import API from '../api';

const Login = () => {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/auth/login', creds);
            const authData = res.data.data;

            if (res.data.success && authData) {
                const role = authData.role.toUpperCase().replace("ROLE_", "");
                localStorage.setItem('user', JSON.stringify({
                    token: authData.token,
                    refreshToken: authData.refreshToken,
                    role: role,
                    username: creds.username
                }));

                if (role === 'ADMIN') navigate('/admin-dashboard');
                else if (role === 'FACULTY') navigate('/faculty-dashboard');
                else navigate('/student');
            }
        } catch (err) {
            console.error("Login Error:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || err.message;
            alert(`Login Failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-portal">
            <div className="portal-content">
                {/* Branding */}
                <div className="portal-brand animate-entrance">
                    <div className="brand-icon-box">
                        <ShieldCheck size={42} color="var(--primary)" />
                    </div>
                    <h1 className="brand-title">Academic Command</h1>
                    <p className="brand-tagline">Institutional Digital Proxy</p>
                </div>

                {/* Login Card */}
                <div className="portal-card-container animate-entrance delay-1">
                    <div className="portal-card glass-panel">
                        <div className="card-header">
                            <h2 className="card-title">System Access</h2>
                            <p className="card-subtitle">Authenticate credentials to initialize session.</p>
                        </div>
                        
                        <form onSubmit={handleLogin} className="portal-form">
                            <div className="form-group animate-entrance delay-2">
                                <label><User size={14} /> Registry Identifier</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        placeholder="Username" 
                                        className="input-field"
                                        onChange={e => setCreds({...creds, username: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group animate-entrance delay-3">
                                <label><Lock size={14} /> Security Protocol</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="input-field"
                                        onChange={e => setCreds({...creds, password: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-actions animate-entrance delay-4">
                                <Link to="/forgot-password" title="Forgot Password" className="text-link">Reset Access Key</Link>
                            </div>
                            
                            <button type="submit" className="primary-button submit-btn animate-entrance delay-4" disabled={loading}>
                                {loading ? 'Validating...' : (
                                    <>
                                        Authorize & Enter <LogIn size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="portal-footer animate-entrance delay-4">
                        <div className="system-status-check">
                            <button 
                                type="button" 
                                className="status-btn"
                                onClick={async () => {
                                    try {
                                        const res = await API.get('/debug/inspect');
                                        alert(`Backend Status:\nVersion: ${res.data.version}\nAdmin Exists: ${res.data.adminExists}\nTimestamp: ${res.data.timestamp}`);
                                    } catch (e) {
                                        alert(`Backend Unreachable: ${e.message}`);
                                    }
                                }}
                            >
                                <Sparkles size={14} /> Run Technical Diagnosis
                            </button>
                        </div>
                        <p className="version-tag">
                            <Sparkles size={12} /> <span>ONYX ENGINE V4.2</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .login-portal {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
                }

                .portal-content {
                    width: 100%;
                    max-width: 460px;
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                }

                .portal-brand { text-align: center; }
                .brand-icon-box {
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .brand-title { 
                    margin: 0; 
                    font-size: 32px; 
                    font-weight: 900; 
                    background: linear-gradient(to bottom, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                }
                .brand-tagline { margin: 8px 0 0; color: var(--text-dim); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; }

                .portal-card { padding: 48px; position: relative; overflow: hidden; }
                .portal-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, transparent, var(--primary), transparent);
                }

                .card-header { margin-bottom: 32px; text-align: center; }
                .card-title { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-main); }
                .card-subtitle { margin: 8px 0 0; color: var(--text-dim); font-size: 14px; }

                .portal-form { display: flex; flex-direction: column; gap: 24px; }
                .form-group { display: flex; flex-direction: column; gap: 10px; }
                .form-group label { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-left: 4px; }

                .form-actions { display: flex; justify-content: flex-end; }
                .text-link { color: var(--text-muted); font-size: 13px; font-weight: 700; transition: color 0.3s; }
                .text-link:hover { color: var(--primary); }

                .submit-btn {
                    padding: 18px;
                    font-size: 16px;
                    font-weight: 900;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .portal-footer { margin-top: 32px; text-align: center; padding-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; gap: 20px; }
                .status-btn {
                    background: rgba(59, 130, 246, 0.05);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: var(--primary);
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin: 0 auto;
                    transition: all 0.3s;
                }
                .status-btn:hover { background: rgba(59, 130, 246, 0.1); border-color: var(--primary); }
                .version-tag { 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    font-size: 10px; 
                    font-weight: 800; 
                    color: var(--text-muted); 
                    letter-spacing: 0.3em;
                }
            `}</style>
        </div>
    );
};

export default Login;