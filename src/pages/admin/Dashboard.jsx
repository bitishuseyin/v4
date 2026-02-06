import React from 'react';
import { Users, GraduationCap, Video, BookOpen, TrendingUp, Clock, Activity } from 'lucide-react';

const Dashboard = () => {
    // Mock veriler
    const stats = [
        { title: 'Toplam Öğrenci', value: '1,234', icon: GraduationCap, trend: '+12%', color: 'bg-blue-500' },
        { title: 'Öğretmen Sayısı', value: '48', icon: Users, trend: '+3%', color: 'bg-green-500' },
        { title: 'Toplam Video', value: '256', icon: Video, trend: '+8%', color: 'bg-purple-500' },
        { title: 'Konu Sayısı', value: '64', icon: BookOpen, trend: '+5%', color: 'bg-orange-500' },
    ];

    const recentActivities = [
        { id: 1, user: 'Ahmet Öğretmen', action: 'yeni video yükledi', target: '9. Sınıf Matematik - Fonksiyonlar', time: '5 dakika önce' },
        { id: 2, user: 'Admin', action: 'onayladı', target: '10. Sınıf Fizik - Kuvvet', time: '12 dakika önce' },
        { id: 3, user: 'Mehmet Öğrenci', action: 'kayıt oldu', target: '9. Sınıf', time: '1 saat önce' },
        { id: 4, user: 'Ayşe Öğretmen', action: 'canlı ders oluşturdu', target: '11. Sınıf Kimya', time: '2 saat önce' },
        { id: 5, user: 'Sistem', action: 'otomatik yedekleme', target: 'Veritabanı', time: '3 saat önce' },
    ];

    const weeklyStats = [
        { day: 'Pzt', videos: 12, students: 45 },
        { day: 'Sal', videos: 8, students: 52 },
        { day: 'Çar', videos: 15, students: 48 },
        { day: 'Per', videos: 10, students: 61 },
        { day: 'Cum', videos: 18, students: 55 },
        { day: 'Cmt', videos: 5, students: 30 },
        { day: 'Paz', videos: 3, students: 25 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex gap-2">
                    <span className="text-sm text-gray-500">Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
                </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp size={16} className="text-green-500" />
                                        <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                                        <span className="text-xs text-gray-400 ml-1">bu hafta</span>
                                    </div>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Haftalık İstatistikler ve Son Aktiviteler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Haftalık İstatistikler Tablosu */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Activity size={20} className="text-primary-600" />
                            Haftalık İstatistikler
                        </h3>
                        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option>Bu Hafta</option>
                            <option>Geçen Hafta</option>
                            <option>Bu Ay</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gün</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yeni Video</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktif Öğrenci</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performans</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {weeklyStats.map((day, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{day.day}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{day.videos}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{day.students}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-500 rounded-full"
                                                        style={{ width: `${(day.videos / 20) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500">{Math.round((day.videos / 20) * 100)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Son Aktiviteler */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Clock size={20} className="text-primary-600" />
                            Son Aktiviteler
                        </h3>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Tümünü Gör
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary-600 font-semibold text-sm">
                                        {activity.user.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold">{activity.user}</span>{' '}
                                        <span className="text-gray-600">{activity.action}</span>
                                    </p>
                                    <p className="text-sm text-primary-600 font-medium truncate">{activity.target}</p>
                                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Hızlı İşlemler</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
                        <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-primary-600">
                            <Users size={24} />
                            <span className="text-sm font-medium">Öğretmen Ekle</span>
                        </div>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
                        <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-primary-600">
                            <GraduationCap size={24} />
                            <span className="text-sm font-medium">Öğrenci Ekle</span>
                        </div>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
                        <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-primary-600">
                            <Video size={24} />
                            <span className="text-sm font-medium">Video Yükle</span>
                        </div>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
                        <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-primary-600">
                            <BookOpen size={24} />
                            <span className="text-sm font-medium">Döküman Ekle</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;