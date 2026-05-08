import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import API from '../api';

const DashboardStats = () => {
    const [stats, setStats] = useState({ total: 0, departments: {}, years: {} });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/students/stats');
                setStats(res.data || { total: 0, departments: {}, years: {} });
            } catch (err) {
                console.error("Stats Fetch Error:", err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Students', value: stats.total, icon: Users, color: '#3b82f6', trend: '+12%' },
        { label: 'Active Depts', value: Object.keys(stats.departments || {}).length, icon: GraduationCap, color: '#10b981', trend: 'Optimal' },
        { label: 'Academic Years', value: Object.keys(stats.years || {}).length, icon: Calendar, color: '#6366f1', trend: 'Current' },
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, idx) => (
                <div 
                    key={idx} 
                    className={`stats-card glass-panel animate-entrance delay-${(idx % 4) + 1}`}
                >
                    <div className="stats-card-header">
                        <div className="icon-box" style={{ '--icon-color': card.color }}>
                            <card.icon size={24} color={card.color} strokeWidth={2.5} />
                        </div>
                        <div className="trend-badge">
                            <TrendingUp size={12} /> {card.trend}
                        </div>
                    </div>
                    
                    <div className="stats-card-body">
                        <span className="stats-label">{card.label}</span>
                        <h2 className="stats-value">{card.value}</h2>
                    </div>
                    
                    <div className="stats-card-footer">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '70%', background: card.color }}></div>
                        </div>
                        <span className="stats-hint">System Synchronized</span>
                    </div>

                    <style>{`
                        .stats-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                            gap: 24px;
                        }

                        .stats-card {
                            padding: 28px;
                            display: flex;
                            flex-direction: column;
                            gap: 24px;
                            position: relative;
                            overflow: hidden;
                        }

                        .stats-card-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                        }

                        .icon-box {
                            width: 52px;
                            height: 52px;
                            border-radius: 14px;
                            background: rgba(var(--icon-color), 0.1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            position: relative;
                        }

                        .icon-box::after {
                            content: '';
                            position: absolute;
                            inset: 0;
                            border-radius: 14px;
                            background: var(--icon-color);
                            opacity: 0.1;
                            filter: blur(8px);
                        }

                        .trend-badge {
                            padding: 6px 12px;
                            border-radius: 20px;
                            background: rgba(16, 185, 129, 0.1);
                            color: #10b981;
                            font-size: 11px;
                            font-weight: 800;
                            display: flex;
                            align-items: center;
                            gap: 4px;
                            border: 1px solid rgba(16, 185, 129, 0.1);
                        }

                        .stats-card-body {
                            display: flex;
                            flex-direction: column;
                        }

                        .stats-label {
                            font-size: 13px;
                            font-weight: 700;
                            color: var(--text-dim);
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }

                        .stats-value {
                            font-size: 40px;
                            font-weight: 900;
                            margin: 4px 0 0;
                            letter-spacing: -0.04em;
                        }

                        .stats-card-footer {
                            display: flex;
                            flex-direction: column;
                            gap: 12px;
                        }

                        .progress-bar {
                            height: 4px;
                            width: 100%;
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 2px;
                            overflow: hidden;
                        }

                        .progress-fill {
                            height: 100%;
                            border-radius: 2px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        }

                        .stats-hint {
                            font-size: 11px;
                            color: var(--text-dim);
                            font-weight: 600;
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
