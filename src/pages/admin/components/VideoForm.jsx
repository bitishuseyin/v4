import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const VideoForm = ({ isOpen, onClose, onSave, initialData, grades, subjects }) => {
    const [formData, setFormData] = useState({
        title: '',
        grade: '',
        topic: '',
        description: '',
        isPublished: false,
        sequentialAccess: false,
        videoFile: null,
        pdfFile: null
    });

    // topics objesini props'tan gelen subjects'ten oluştur veya fallback kullan
    const getTopicsForGrade = (gradeId) => {
        if (!subjects || !gradeId) return [];
        return subjects[gradeId] || [];
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                grade: initialData.grade || '',
                topic: initialData.topic || '',
                description: initialData.description || '',
                isPublished: initialData.status === 'published',
                sequentialAccess: initialData.sequentialAccess || false,
                videoFile: initialData.videoFile || null,
                pdfFile: initialData.pdfFile || null
            });
        } else {
            setFormData({
                title: '',
                grade: '',
                topic: '',
                description: '',
                isPublished: false,
                sequentialAccess: false,
                videoFile: null,
                pdfFile: null
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.grade || !formData.topic) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }
        onSave(formData);
        toast.success(initialData ? 'Video güncellendi' : 'Video eklendi');
        onClose();
    };

    const currentTopics = getTopicsForGrade(formData.grade);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Video Güncelle' : 'Yeni Video Ekle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload size={32} className="text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Sınıf *"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value, topic: '' })}
                        options={(grades || []).map(g => ({ value: g.id, label: g.name }))}
                    />
                    <Select
                        label="Konu *"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        options={(currentTopics || []).map(t => ({ value: t.name || t, label: t.name || t }))}
                        disabled={!formData.grade || currentTopics.length === 0}
                    />
                </div>

                {!formData.grade && (
                    <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        Lütfen önce sınıf seçin
                    </p>
                )}

                {formData.grade && currentTopics.length === 0 && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Bu sınıfa ait konu bulunmuyor. Lütfen önce Müfredat sayfasından konu ekleyin.
                    </p>
                )}

                <Input
                    label="Video Başlığı *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: 9. Sınıf Fonksiyonlar 1"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                        placeholder="Video açıklaması..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Video Dosyası</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setFormData({ ...formData, videoFile: e.target.files[0] })}
                                className="hidden"
                                id="videoFile"
                            />
                            <label htmlFor="videoFile" className="cursor-pointer">
                                <Upload size={20} className="mx-auto mb-2 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {formData.videoFile?.name || 'Video seçin'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">PDF Döküman (Opsiyonel)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFormData({ ...formData, pdfFile: e.target.files[0] })}
                                className="hidden"
                                id="pdfFile"
                            />
                            <label htmlFor="pdfFile" className="cursor-pointer">
                                <FileText size={20} className="mx-auto mb-2 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {formData.pdfFile?.name || 'PDF seçin'}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.sequentialAccess}
                                onChange={(e) => setFormData({ ...formData, sequentialAccess: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Sıralı Erişim</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Yayınla</span>
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

export default VideoForm;