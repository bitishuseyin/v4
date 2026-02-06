import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Mock kullanıcı verileri (Gerçek projede API'den gelecek)
    const mockUsers = [
        { id: 1, email: 'admin@okul.com', password: '123456', role: 'admin', name: 'Sistem Yöneticisi' },
        { id: 2, email: 'ogretmen@okul.com', password: '123456', role: 'teacher', name: 'Ahmet Öğretmen', grade: '9' },
        { id: 3, email: 'ogrenci@okul.com', password: '123456', role: 'student', name: 'Mehmet Öğrenci', grade: '9' },
        { id: 4, email: 'misafir@okul.com', password: '123456', role: 'guest', name: 'Misafir Kullanıcı' },
    ];

    const login = (email, password, role) => {
        const foundUser = mockUsers.find(
            u => u.email === email && u.password === password && u.role === role
        );

        if (foundUser) {
            setUser(foundUser);
            return { success: true, user: foundUser };
        }
        return { success: false, error: 'Geçersiz e-posta, şifre veya rol!' };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);