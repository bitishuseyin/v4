import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Link2, Video, AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const LessonForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        topic: '',
        grade: '',
        subject: '',
        date: '',
        time: '',
        duration: '',
        platform: 'zoom',
        link: '',
        isActive: false
    });

    // Güvenlik için topics objesi - tüm sınıflar için tanımlı
    const topics = {
        '5': ['Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Türkçe', 'İngilizce'],
        '6': ['Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Türkçe', 'İngilizce'],
        '7': ['Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Türkçe', 'İngilizce'],
        '8': ['Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Türkçe', 'İngilizce'],
        '9': ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Tarih', 'Coğrafya'],
        '10': ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Edebiyat'],
        '11': ['Matematik', 'Fizik', 'Kimya', 'Edebiyat', 'Felsefe', 'Yabancı Dil', 'Tarih'],
        '12': ['YKS Hazırlık', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Edebiyat']
    };

    const platforms = [
        { value: 'zoom', label: 'Zoom', icon: '🔵', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { value: 'meet', label: 'Google Meet', icon: '🟢', color: 'bg-green-100 text-green-800 border-green-200' },
        { value: 'teams', label: 'Microsoft Teams', icon: '🟣', color: 'bg-purple-100 text-purple-800 border-purple-200' }
    ];

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                topic: initialData.topic || '',
                grade: initialData.grade || '',
                subject: initialData.subject || '',
                date: initialData.date || '',
                time: initialData.time || '',
                duration: initialData.duration || '',
                platform: initialData.platform || 'zoom',
                link: initialData.link || '',
                isActive: initialData.status === 'active' || false
            });
        } else if (!isOpen) {
            // Modal kapandığında formu resetle
            setFormData({
                topic: '',
                grade: '',
                subject: '',
                date: '',
                time: '',
                duration: '',
                platform: 'zoom',
                link: '',
                isActive: false
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasyon
        if (!formData.topic || !formData.grade || !formData.subject || !formData.date || !formData.time || !formData.link) {
            toast.error('Lütfen tüm zorunlu alanları doldurun');
            return;
        }

        // Link formatı kontrolü
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(formData.link)) {
            toast.error('Geçerli bir toplantı linki girin (http:// veya https:// ile başlamalı)');
            return;
        }

        onSave(formData);
        onClose();
    };

    const getPlatformIcon = (platform) => {
        const p = platforms.find(pl => pl.value === platform);
        return p ? p.icon : '💻';
    };

    // Güvenli konu listesi alma
    const getTopicsForGrade = (grade) => {
        if (!grade || !topics) return [];
        return topics[grade] || [];
    };

    const availableTopics = getTopicsForGrade(formData.grade);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Canlı Ders Güncelle' : 'Yeni Canlı Ders Ekle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-4xl mb-3 shadow-sm">
                        {getPlatformIcon(formData.platform)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'Bilgileri Güncelle' : 'Yeni Canlı Ders Ekle'}
                    </h3>
                    <p className="text-sm text-gray-500">Canlı ders bilgilerini doldurun</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Sınıf *"
                        value={formData.grade}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, grade: e.target.value, subject: '' }));
                        }}
                        options={[
                            { value: '5', label: '5. Sınıf' },
                            { value: '6', label: '6. Sınıf' },
                            { value: '7', label: '7. Sınıf' },
                            { value: '8', label: '8. Sınıf' },
                            { value: '9', label: '9. Sınıf' },
                            { value: '10', label: '10. Sınıf' },
                            { value: '11', label: '11. Sınıf' },
                            { value: '12', label: '12. Sınıf' }
                        ]}
                    />
                    <Select
                        label="Konu *"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        options={availableTopics.map(t => ({ value: t, label: t }))}
                        disabled={!formData.grade}
                        placeholder={formData.grade ? "Konu seçin..." : "Önce sınıf seçin"}
                    />
                </div>

                <Input
                    label="Ders Başlığı *"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Örn: Türev Uygulamaları"
                />

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarih *</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Saat *</label>
                        <div className="relative">
                            <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Süre (dk) *</label>
                        <input
                            type="number"
                            min="15"
                            max="180"
                            step="15"
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="45"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                    <div className="grid grid-cols-3 gap-3">
                        {platforms.map((platform) => (
                            <button
                                key={platform.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, platform: platform.value }))}
                                className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all
                  ${formData.platform === platform.value
                                        ? `${platform.color} border-current ring-2 ring-offset-1 ring-current`
                                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                                    }`}
                            >
                                <span className="text-xl">{platform.icon}</span>
                                <span className="text-sm font-medium">{platform.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Input
                    label="Toplantı Linki *"
                    icon={Link2}
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://zoom.us/j/123456789"
                    type="url"
                />

                {/* Uyarı */}
                {!formData.isActive && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <p>Bu ders henüz yayınlanmadı. Öğrenciler göremez.</p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                                {formData.isActive ? 'Aktif (Yayında)' : 'Pasif (Taslak)'}
                            </span>
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            İptal
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default LessonForm;