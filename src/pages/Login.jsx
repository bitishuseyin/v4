import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, GraduationCap, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { id: 'guest', label: 'Misafir', icon: User, color: 'bg-gray-500', desc: 'Sınırlı erişim' },
        { id: 'student', label: 'Öğrenci', icon: GraduationCap, color: 'bg-green-500', desc: 'Dersleri görüntüle' },
        { id: 'teacher', label: 'Öğretmen', icon: Users, color: 'bg-blue-500', desc: 'İçerik yönetimi' },
        { id: 'admin', label: 'Admin', icon: Shield, color: 'bg-purple-600', desc: 'Tam yetki' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simüle edilmiş API bekleme süresi
        setTimeout(() => {
            const result = login(email, password, selectedRole);

            if (result.success) {
                toast.success(`Hoş geldiniz, ${result.user.name}!`, {
                    position: "top-right",
                    autoClose: 2000,
                });

                // Role göre yönlendirme
                setTimeout(() => {
                    if (result.user.role === 'admin') navigate('/admin/dashboard');
                    else if (result.user.role === 'teacher') navigate('/teacher/dashboard');
                    else if (result.user.role === 'student') navigate('/student/dashboard');
                    else navigate('/guest/explore');
                }, 1000);
            } else {
                toast.error(result.error, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Sol Taraf - Bilgi Alanı */}
                <div className="bg-primary-600 text-white p-8 md:w-2/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen size={40} />
                            <h1 className="text-2xl font-bold">E-Okul Sistemi</h1>
                        </div>
                        <p className="text-primary-100 mb-8 leading-relaxed">
                            Eğitim platformumuza hoş geldiniz. Rolünüzü seçerek giriş yapabilirsiniz.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <h3 className="font-semibold mb-1">🎓 Öğrenciler İçin</h3>
                            <p className="text-sm text-primary-100">Videolara erişim, canlı dersler ve rehberlik</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <h3 className="font-semibold mb-1">👨‍🏫 Öğretmenler İçin</h3>
                            <p className="text-sm text-primary-100">İçerik yükleme, ders yönetimi</p>
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf - Form */}
                <div className="p-8 md:w-3/5">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Giriş Yap</h2>
                    <p className="text-gray-500 mb-8">Devam etmek için rolünüzü seçin ve bilgilerinizi girin</p>

                    {/* Rol Seçimi Kartları */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const isSelected = selectedRole === role.id;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${isSelected
                                            ? `border-${role.color.replace('bg-', '')} bg-${role.color.replace('bg-', '')}/10 ring-2 ring-${role.color.replace('bg-', '')}/20`
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`${role.color} text-white p-2 rounded-lg`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-sm text-gray-800">{role.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{role.desc}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta Adresi</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="ornek@okul.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-gray-600">Beni hatırla</span>
                            </label>
                            <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                                Şifremi unuttum?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800 font-medium mb-1">Demo Giriş Bilgileri:</p>
                        <p className="text-xs text-blue-600">Admin: admin@okul.com / 123456</p>
                        <p className="text-xs text-blue-600">Öğretmen: ogretmen@okul.com / 123456</p>
                        <p className="text-xs text-blue-600">Öğrenci: ogrenci@okul.com / 123456</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;