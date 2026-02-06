import React, { useState, useEffect } from 'react';
import { Mail, Phone, GraduationCap, X } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const TeacherForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        grades: [],
        isActive: true
    });

    const gradeGroups = [
        {
            title: 'Ortaokul',
            grades: [
                { id: '5', name: '5. Sınıf' },
                { id: '6', name: '6. Sınıf' },
                { id: '7', name: '7. Sınıf' },
                { id: '8', name: '8. Sınıf' }
            ]
        },
        {
            title: 'Lise',
            grades: [
                { id: '9', name: '9. Sınıf' },
                { id: '10', name: '10. Sınıf' },
                { id: '11', name: '11. Sınıf' },
                { id: '12', name: '12. Sınıf' }
            ]
        }
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                grades: initialData.grades || [],
                isActive: initialData.status === 'active'
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                grades: [],
                isActive: true
            });
        }
    }, [initialData, isOpen]);

    const toggleGrade = (gradeId) => {
        setFormData(prev => {
            const currentGrades = prev.grades || [];
            if (currentGrades.includes(gradeId)) {
                return { ...prev, grades: currentGrades.filter(g => g !== gradeId) };
            } else {
                return { ...prev, grades: [...currentGrades, gradeId] };
            }
        });
    };

    const selectAllInGroup = (groupGrades) => {
        const groupIds = groupGrades.map(g => g.id);
        const currentGrades = formData.grades || [];
        const allSelected = groupIds.every(id => currentGrades.includes(id));

        if (allSelected) {
            setFormData(prev => ({
                ...prev,
                grades: currentGrades.filter(g => !groupIds.includes(g))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                grades: [...new Set([...currentGrades, ...groupIds])]
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        const currentGrades = formData.grades || [];
        if (currentGrades.length === 0) {
            toast.error('Lütfen en az bir sınıf seçin');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Geçerli bir e-posta adresi girin');
            return;
        }

        onSave({ ...formData, grades: currentGrades });
        onClose();
    };

    const getGradeName = (gradeId) => {
        const allGrades = [...gradeGroups[0].grades, ...gradeGroups[1].grades];
        const grade = allGrades.find(g => g.id === gradeId);
        return grade?.name || gradeId;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Öğretmen Güncelle' : 'Yeni Öğretmen Ekle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
                        {formData.firstName ? formData.firstName.charAt(0) : '👨‍🏫'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'Bilgileri Güncelle' : 'Yeni Öğretmen Ekle'}
                    </h3>
                    <p className="text-sm text-gray-500">Öğretmen bilgilerini doldurun</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Ad *"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Ahmet"
                    />
                    <Input
                        label="Soyad *"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Yılmaz"
                    />
                </div>

                <Input
                    label="E-posta Adresi *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ahmet.yilmaz@okul.com"
                />

                <Input
                    label="Telefon"
                    icon={Phone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0555 123 4567"
                />

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <GraduationCap size={20} className="text-gray-500" />
                        <label className="text-sm font-medium text-gray-700">
                            Verdiği Sınıflar * <span className="text-gray-400">({(formData.grades || []).length} seçili)</span>
                        </label>
                    </div>

                    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {gradeGroups.map((group) => (
                            <div key={group.title} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700">{group.title}</h4>
                                    <button
                                        type="button"
                                        onClick={() => selectAllInGroup(group.grades)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {group.grades.every(g => (formData.grades || []).includes(g.id)) ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {group.grades.map((grade) => {
                                        const isSelected = (formData.grades || []).includes(grade.id);
                                        return (
                                            <button
                                                key={grade.id}
                                                type="button"
                                                onClick={() => toggleGrade(grade.id)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                          ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                                                    }`}
                                            >
                                                {grade.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {(formData.grades || []).length > 0 && (
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">Seçili Sınıflar:</p>
                                <div className="flex flex-wrap gap-1">
                                    {[...(formData.grades || [])].sort().map((gradeId) => (
                                        <span
                                            key={gradeId}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                        >
                                            {getGradeName(gradeId)}
                                            <button
                                                type="button"
                                                onClick={() => toggleGrade(gradeId)}
                                                className="hover:text-blue-900"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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

export default TeacherForm;