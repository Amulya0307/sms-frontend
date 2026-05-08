import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import AddStudent from './components/AddStudent';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EditStudent from './components/EditStudent';
import ProtectedRoute from './components/ProtectedRoute';

import FacultyDashboard from './components/FacultyDashboard';
import FacultyProfile from './components/FacultyProfile';
import AdminFacultyManager from './components/AdminFacultyManager';
import EditProfile from './components/EditProfile';

const App = () => {
    return (
        <Router>
            <div className="mesh-gradient">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div className="blob blob-4"></div>
            </div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Admin Routes */}
                <Route 
                    path="/admin-dashboard/:tab?" 
                    element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} 
                />
                <Route 
                    path="/add-student" 
                    element={<ProtectedRoute role="ADMIN"><AddStudent /></ProtectedRoute>} 
                />
                <Route 
                    path="/edit-student" 
                    element={<ProtectedRoute role="ADMIN"><EditStudent /></ProtectedRoute>} 
                />
                
                {/* Faculty Routes */}
                <Route 
                    path="/faculty-dashboard/:tab?" 
                    element={<ProtectedRoute role="FACULTY"><FacultyDashboard /></ProtectedRoute>} 
                />
                <Route 
                    path="/faculty-profile" 
                    element={<ProtectedRoute role="FACULTY"><FacultyProfile /></ProtectedRoute>} 
                />
                
                {/* Student Routes */}
                <Route 
                    path="/student/:tab?" 
                    element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} 
                />
                <Route 
                    path="/edit-profile" 
                    element={<ProtectedRoute role="STUDENT"><EditProfile /></ProtectedRoute>} 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;