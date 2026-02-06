import React, { useState, useEffect } from 'react';
import { Type, Image, BookOpen } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const ContentForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'motivation',
        grade: '',
        content: '',
        image: null
    });

    const grades = [
        { id: 'all', name: 'Tüm Sınıflar' },
        { id: '5', name: '5. Sınıf' },
        { id: '6', name: '6. Sınıf' },
        { id: '7', name: '7. Sınıf' },
        { id: '8', name: '8. Sınıf' },
        { id: '9', name: '9. Sınıf' },
        { id: '10', name: '10. Sınıf' },
        { id: '11', name: '11. Sınıf' },
        { id: '12', name: '12. Sınıf' }
    ];

    const types = [
        { value: 'motivation', label: 'Motivasyon', icon: '💪', color: 'bg-green-100 text-green-700' },
        { value: 'advice', label: 'Tavsiye', icon: '💡', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'announcement', label: 'Duyuru', icon: '📢', color: 'bg-red-100 text-red-700' }
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                type: initialData.type || 'motivation',
                grade: initialData.grade || '',
                content: initialData.content || '',
                image: initialData.image || null
            });
        } else {
            setFormData({
                title: '',
                type: 'motivation',
                grade: '',
                content: '',
                image: null
            });
        }
    }, [initialData, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Resim boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            setFormData({ ...formData, image: { name: file.name, url: URL.createObjectURL(file) } });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.grade || !formData.content) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        onSave(formData);
        onClose();
    };

    const selectedType = types.find(t => t.value === formData.type);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'İçeriği Güncelle' : 'Yeni İçerik Ekle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3 shadow-lg ${selectedType?.color || 'bg-gray-100'}`}>
                        {selectedType?.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'İçeriği Güncelle' : 'Yeni İçerik Ekle'}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Tip *"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        options={types.map(t => ({ value: t.value, label: `${t.icon} ${t.label}` }))}
                    />
                    <Select
                        label="Sınıf *"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        options={grades.map(g => ({ value: g.id, label: g.name }))}
                    />
                </div>

                <Input
                    label="Başlık *"
                    icon={BookOpen}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: Sınav Stresiyle Başa Çıkma"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">İçerik *</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="İçeriği buraya yazın..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Image size={16} />
                        Resim (Opsiyonel)
                    </label>
                    {!formData.image ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors bg-gray-50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="contentImage"
                            />
                            <label htmlFor="contentImage" className="cursor-pointer block">
                                <Image size={24} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">Resim seçin</p>
                                <p className="text-xs text-gray-400">Maksimum 5MB</p>
                            </label>
                        </div>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                            <img src={formData.image.url} alt="Preview" className="w-full h-32 object-cover" />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: null })}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <span className="sr-only">Kaldır</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
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

export default ContentForm;