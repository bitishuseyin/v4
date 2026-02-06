import React, { useState, useEffect } from 'react';
import {
    Settings, Database, Download, Upload, Trash2,
    AlertTriangle, CheckCircle, RefreshCw, Save,
    Mail, Globe, AlertOctagon, FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const System = () => {
    // Genel Ayarlar State
    const [generalSettings, setGeneralSettings] = useState({
        siteTitle: 'E-Okul Sistemi',
        contactEmail: 'info@okul.com',
        maintenanceMode: false
    });

    // Loglar State
    const [logs, setLogs] = useState([
        { id: 1, date: '2024-02-07 14:30:15', type: 'info', message: 'Admin giriş yaptı: admin@okul.com' },
        { id: 2, date: '2024-02-07 14:28:22', type: 'success', message: 'Yeni video yüklendi: Türev Uygulamaları' },
        { id: 3, date: '2024-02-07 13:15:44', type: 'warning', message: 'Başarısız giriş denemesi: 192.168.1.1' },
        { id: 4, date: '2024-02-07 12:00:00', type: 'error', message: 'Veritabanı bağlantı hatası (timeout)' },
        { id: 5, date: '2024-02-06 09:30:00', type: 'success', message: 'Sistem yedeği alındı' }
    ]);

    const [isLoading, setIsLoading] = useState(false);

    // Ayarları Kaydet
    const handleSaveSettings = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast.success('Ayarlar başarıyla kaydedildi');
            setIsLoading(false);
        }, 800);
    };

    // Yedekleme
    const handleBackup = () => {
        toast.info('Veritabanı yedekleniyor...');
        setTimeout(() => {
            toast.success('Yedekleme tamamlandı! Dosya indiriliyor...');
            // Gerçek projede burada dosya indirme işlemi olur
        }, 2000);
    };

    // Geri Yükleme
    const handleRestore = () => {
        if (window.confirm('Bu işlem mevcut verilerin üzerine yazacaktır. Devam etmek istiyor musunuz?')) {
            toast.info('Yedek dosyası yükleniyor...');
            setTimeout(() => {
                toast.success('Sistem başarıyla geri yüklendi!');
            }, 2000);
        }
    };

    // Logları Temizle
    const handleClearLogs = () => {
        if (window.confirm('Tüm sistem logları silinecektir. Bu işlem geri alınamaz!')) {
            setLogs([]);
            toast.success('Loglar temizlendi');
        }
    };

    // Örnek Verileri Yükle
    const handleLoadSampleData = () => {
        if (window.confirm('Örnek veriler yüklenecek. Mevcut veriler korunacaktır. Devam edilsin mi?')) {
            toast.info('Örnek veriler yükleniyor...');
            setTimeout(() => {
                toast.success('Örnek veriler başarıyla yüklendi!');
            }, 1500);
        }
    };

    // Tüm Verileri Temizle
    const handleClearAllData = () => {
        if (window.confirm('UYARI! Tüm veriler (öğrenciler, öğretmenler, videolar vb.) kalıcı olarak silinecektir. Bu işlem geri alınamaz!')) {
            if (window.prompt('Silme işlemini onaylamak için "SİL" yazın:') === 'SİL') {
                toast.info('Veriler siliniyor...');
                setTimeout(() => {
                    toast.success('Tüm veriler temizlendi. Sistem varsayılan duruma döndü.');
                }, 2000);
            } else {
                toast.error('Onay metni hatalı. İşlem iptal edildi.');
            }
        }
    };

    const getLogIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-green-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'error': return <AlertOctagon size={16} className="text-red-500" />;
            default: return <FileText size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Sistem Ayarları</h1>
                <p className="text-gray-500 mt-1">Genel ayarlar, yedekleme ve sistem logları</p>
            </div>

            {/* Genel Ayarlar */}
            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <Settings className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">Genel Ayarlar</h2>
                </div>

                <div className="space-y-4 max-w-2xl">
                    <Input
                        label="Site Başlığı"
                        value={generalSettings.siteTitle}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
                        placeholder="Okul Adı"
                    />

                    <Input
                        label="İletişim E-posta"
                        type="email"
                        icon={Mail}
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                        placeholder="info@okul.com"
                    />

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <Globe size={20} className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-800">Bakım Modu</p>
                                <p className="text-sm text-gray-500">Aktif edildiğinde sadece adminler giriş yapabilir</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={generalSettings.maintenanceMode}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    </div>

                    {generalSettings.maintenanceMode && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                            <AlertTriangle size={16} />
                            <span>Bakım modu aktif! Sadece yöneticiler sisteme erişebilir.</span>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            onClick={handleSaveSettings}
                            isLoading={isLoading}
                            className="flex items-center gap-2"
                        >
                            <Save size={18} />
                            Ayarları Kaydet
                        </Button>
                    </div>
                </div>
            </div>

            {/* Yedekleme & Geri Yükleme */}
            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <Database className="text-purple-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">Yedekleme & Geri Yükleme</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Download className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Veritabanını Yedekle</h3>
                                <p className="text-sm text-gray-500 mt-1">Tüm verilerinizi indirilebilir bir dosya olarak kaydedin.</p>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={handleBackup} className="w-full">
                            Yedekle
                        </Button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Upload className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Yedekten Geri Yükle</h3>
                                <p className="text-sm text-gray-500 mt-1">Önceden alınan bir yedeği sisteme yükleyin.</p>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={handleRestore} className="w-full">
                            Geri Yükle
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sistem Logları */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <FileText className="text-orange-600" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">Sistem Logları</h2>
                    </div>
                    {logs.length > 0 && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleClearLogs}
                            className="flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Logları Temizle
                        </Button>
                    )}
                </div>

                <div className="border border-gray-200 rounded-lg bg-gray-900 h-64 overflow-y-auto font-mono text-sm">
                    {logs.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Log bulunmuyor
                        </div>
                    ) : (
                        <div className="p-4 space-y-2">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3 text-gray-300 hover:bg-gray-800 p-2 rounded">
                                    <span className="text-gray-500 whitespace-nowrap">[{log.date}]</span>
                                    <span className="mt-0.5">{getLogIcon(log.type)}</span>
                                    <span className="break-all">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Son 100 olay gösteriliyor</p>
            </div>

            {/* Veri Yönetimi */}
            <div className="card border-red-200 bg-red-50">
                <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle className="text-red-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">Veri Yönetimi</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-2">Örnek Verileri Yükle</h3>
                        <p className="text-sm text-gray-500 mb-4">Sistemi test etmek için örnek öğrenci, öğretmen ve içerik verileri ekler.</p>
                        <Button
                            variant="secondary"
                            onClick={handleLoadSampleData}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Örnek Verileri Yükle
                        </Button>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-red-200">
                        <h3 className="font-semibold text-gray-800 mb-2 text-red-700">Tüm Verileri Temizle</h3>
                        <p className="text-sm text-gray-500 mb-4">Dikkat! Bu işlem tüm verileri kalıcı olarak siler.</p>
                        <Button
                            variant="danger"
                            onClick={handleClearAllData}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            Tüm Verileri Temizle
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default System;