import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, Video,
    Calendar, FileText, BookOpen, Settings, LogOut,
    Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/teachers', label: 'Öğretmenler', icon: Users },
        { path: '/admin/students', label: 'Öğrenciler', icon: GraduationCap },
        { path: '/admin/videos', label: 'Videolar', icon: Video },
        { path: '/admin/live-lessons', label: 'Canlı Dersler', icon: Calendar },
        { path: '/admin/documents', label: 'Dökümanlar', icon: FileText },
        { path: '/admin/guidance', label: 'Rehberlik', icon: BookOpen },
        { path: '/admin/system', label: 'Sistem', icon: Settings },
        { path: '/admin/curriculum', label: 'Müfredat', icon: BookOpen }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {sidebarOpen && <span className="text-xl font-bold text-primary-600">Admin Panel</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}
                `}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Çıkış Yap</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Yönetim Paneli</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;