import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const StudentForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        parentPhone: '',
        grade: '',
        membershipStart: '',
        membershipEnd: '',
        notes: '',
        isActive: true
    });

    const grades = [
        { id: '5', name: '5. Sınıf' },
        { id: '6', name: '6. Sınıf' },
        { id: '7', name: '7. Sınıf' },
        { id: '8', name: '8. Sınıf' },
        { id: '9', name: '9. Sınıf' },
        { id: '10', name: '10. Sınıf' },
        { id: '11', name: '11. Sınıf' },
        { id: '12', name: '12. Sınıf' }
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                parentPhone: initialData.parentPhone || '',
                grade: initialData.grade || '',
                membershipStart: initialData.membershipStart || '',
                membershipEnd: initialData.membershipEnd || '',
                notes: initialData.notes || '',
                isActive: initialData.status === 'active'
            });
        } else {
            // Yeni öğrenci için varsayılan tarihler (bugünden itibaren 1 yıl)
            const today = new Date().toISOString().split('T')[0];
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                parentPhone: '',
                grade: '',
                membershipStart: today,
                membershipEnd: nextYear.toISOString().split('T')[0],
                notes: '',
                isActive: true
            });
        }
    }, [initialData, isOpen]);

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;

        let result = '';
        if (years > 0) result += `${years} yıl `;
        if (months > 0) result += `${months} ay `;
        if (days > 0) result += `${days} gün`;

        return result.trim() || '0 gün';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.grade) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Geçerli bir e-posta adresi girin');
                return;
            }
        }

        onSave(formData);
        onClose();
    };

    const duration = calculateDuration(formData.membershipStart, formData.membershipEnd);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Öğrenci Güncelle' : 'Yeni Öğrenci Ekle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
                        {formData.firstName ? formData.firstName.charAt(0) : '👨‍🎓'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'Bilgileri Güncelle' : 'Yeni Öğrenci Ekle'}
                    </h3>
                    <p className="text-sm text-gray-500">Öğrenci bilgilerini doldurun</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Ad *"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Mehmet"
                    />
                    <Input
                        label="Soyad *"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Yılmaz"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="E-posta"
                        type="email"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="mehmet@okul.com"
                    />
                    <Input
                        label="Telefon"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0555 123 4567"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Veli Telefonu"
                        icon={Phone}
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        placeholder="0555 987 6543"
                    />
                    <Select
                        label="Sınıf *"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        options={grades.map(g => ({ value: g.id, label: g.name }))}
                    />
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar size={16} />
                        Üyelik Bilgileri
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlangıç Tarihi</label>
                            <input
                                type="date"
                                value={formData.membershipStart}
                                onChange={(e) => setFormData({ ...formData, membershipStart: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bitiş Tarihi</label>
                            <input
                                type="date"
                                value={formData.membershipEnd}
                                onChange={(e) => setFormData({ ...formData, membershipEnd: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {duration && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Üyelik Süresi:</span>
                            <span className="text-sm font-bold text-blue-700">{duration}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        Notlar
                    </h4>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Öğrenci hakkında notlar..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-sm"
                    />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                                Hesap {formData.isActive ? 'Aktif' : 'Pasif'}
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

export default StudentForm;