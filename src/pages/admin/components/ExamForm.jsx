import React, { useState, useEffect } from 'react';
import { Calendar, FileText } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const ExamForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        grade: '',
        date: '',
        description: ''
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
                title: initialData.title || '',
                grade: initialData.grade || '',
                date: initialData.date || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({
                title: '',
                grade: '',
                date: '',
                description: ''
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.grade || !formData.date) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Sınav Güncelle' : 'Yeni Sınav Ekle'}
            size="sm"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mb-3 shadow-lg">
                        📅
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'Sınavı Güncelle' : 'Yeni Sınav Ekle'}
                    </h3>
                    <p className="text-sm text-gray-500">Sınav bilgilerini doldurun</p>
                </div>

                <Input
                    label="Sınav Adı *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: 1. Dönem Matematik Sınavı"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Sınıf *"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        options={grades.map(g => ({ value: g.id, label: g.name }))}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarih *</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                        <FileText size={16} />
                        Açıklama
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Sınav hakkında detaylı bilgi..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        İptal
                    </Button>
                    <Button type="submit">
                        {initialData ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ExamForm;