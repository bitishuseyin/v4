import React, { useState, useEffect } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const DocumentForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        grade: '',
        topic: '',
        file: null,
        isPublished: false
    });

    const topics = {
        '9': ['Matematik Temelleri', 'Fonksiyonlar', 'Geometri', 'Fizik', 'Kimya'],
        '10': ['Türev', 'İntegral', 'Fizik Temelleri', 'Kimya', 'Biyoloji'],
        '11': ['Edebiyat', 'Felsefe', 'Tarih', 'Coğrafya', 'Yabancı Dil'],
        '12': ['YKS Hazırlık', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilimler']
    };

    const fileTypes = {
        'pdf': { label: 'PDF', color: 'bg-red-100 text-red-700', icon: '📄' },
        'doc': { label: 'Word', color: 'bg-blue-100 text-blue-700', icon: '📝' },
        'docx': { label: 'Word', color: 'bg-blue-100 text-blue-700', icon: '📝' },
        'ppt': { label: 'PowerPoint', color: 'bg-orange-100 text-orange-700', icon: '📊' },
        'pptx': { label: 'PowerPoint', color: 'bg-orange-100 text-orange-700', icon: '📊' }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                grade: initialData.grade || '',
                topic: initialData.topic || '',
                file: initialData.file || null,
                isPublished: initialData.status === 'published'
            });
        } else {
            setFormData({
                title: '',
                grade: '',
                topic: '',
                file: null,
                isPublished: false
            });
        }
    }, [initialData, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            const allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];

            if (!allowedTypes.includes(extension)) {
                toast.error('Sadece PDF, Word veya PowerPoint dosyaları yüklenebilir!');
                return;
            }

            setFormData(prev => ({
                ...prev,
                file: {
                    name: file.name,
                    type: extension,
                    size: file.size
                }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.grade || !formData.topic) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        if (!initialData && !formData.file) {
            toast.error('Lütfen bir dosya seçin');
            return;
        }

        onSave(formData);
        onClose();
    };

    const getFileIcon = (type) => {
        return fileTypes[type]?.icon || '📎';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Döküman Güncelle' : 'Yeni Döküman Ekle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
                        {formData.file ? getFileIcon(formData.file.type) : '📁'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'Bilgileri Güncelle' : 'Yeni Döküman Ekle'}
                    </h3>
                    <p className="text-sm text-gray-500">Döküman bilgilerini doldurun</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Sınıf *"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value, topic: '' })}
                        options={[
                            { value: '9', label: '9. Sınıf' },
                            { value: '10', label: '10. Sınıf' },
                            { value: '11', label: '11. Sınıf' },
                            { value: '12', label: '12. Sınıf' }
                        ]}
                    />
                    <Select
                        label="Konu *"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        options={(topics[formData.grade] || []).map(t => ({ value: t, label: t }))}
                        disabled={!formData.grade}
                    />
                </div>

                <Input
                    label="Döküman Başlığı *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: 9. Sınıf Matematik Konu Anlatımı"
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dosya *</label>
                    {!formData.file ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors bg-gray-50">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="documentFile"
                            />
                            <label htmlFor="documentFile" className="cursor-pointer block">
                                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600 mb-1">PDF, Word veya PowerPoint dosyası yükleyin</p>
                                <p className="text-xs text-gray-400">Maksimum 50MB</p>
                            </label>
                        </div>
                    ) : (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                    {getFileIcon(formData.file.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{formData.file.name}</p>
                                    <p className="text-xs text-gray-500">{fileTypes[formData.file.type]?.label || 'Dosya'} • {formatFileSize(formData.file.size)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, file: null })}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    title="Kaldır"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-5 h-5"
                            />
                            <span className="text-sm font-medium text-gray-700">Yayınla</span>
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

export default DocumentForm;