import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import Teachers from './pages/Admin/Teachers';
import Students from './pages/Admin/Students';
import AdminVideos from './pages/Admin/Videos';
import AdminLayout from './pages/Admin/Layout';
import LiveLessons from './pages/Admin/LiveLessons';
import Documents from './pages/Admin/Documents';
import Guidance from './pages/Admin/Guidance';
import System from './pages/Admin/System';
import Curriculum from './pages/Admin/Curriculum';

// Korunan Rota Bileşeni
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="teachers" element={<Teachers />} />
                        <Route path="students" element={<Students />} />
                        <Route path="videos" element={<AdminVideos />} />
                        <Route path="live-lessons" element={<LiveLessons />} />
                        <Route path="documents" element={<Documents />} />
                        <Route path="guidance" element={<Guidance />} />
                        <Route path="system" element={<System />} />
                        <Route path="curriculum" element={<Curriculum />} />
                        {/* Diğer admin sayfaları buraya eklenecek */}
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
            <ToastContainer />
        </AuthProvider>
    );
};

export default App;