import React, { useState } from 'react';
import { Plus, Calendar, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import ExamList from './components/ExamList';
import ExamForm from './components/ExamForm';
import ContentGrid from './components/ContentGrid';
import ContentForm from './components/ContentForm';

const Guidance = () => {
    const [exams, setExams] = useState([
        {
            id: 1,
            title: '1. Dönem Matematik Sınavı',
            grade: '9',
            date: '2024-02-15',
            description: '9. sınıf matematik 1. dönem değerlendirme sınavı',
            createdAt: '2024-01-10'
        },
        {
            id: 2,
            title: 'Fen Bilimleri Ortak Sınav',
            grade: '10',
            date: '2024-02-20',
            description: 'Fizik, Kimya ve Biyoloji ortak sınavı',
            createdAt: '2024-01-12'
        }
    ]);

    const [contents, setContents] = useState([
        {
            id: 1,
            type: 'motivation',
            title: 'Sınav Stresiyle Başa Çıkma Yöntemleri',
            grade: 'all',
            content: 'Sınav öncesi derin nefes alma teknikleri ve pozitif düşünme stratejileri...',
            image: null,
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            type: 'advice',
            title: 'Verimli Ders Çalışma Programı',
            grade: '12',
            content: 'YKS hazırlığında zaman yönetimi ve etkili çalışma teknikleri...',
            image: null,
            createdAt: '2024-01-14'
        },
        {
            id: 3,
            type: 'announcement',
            title: 'Rehberlik Servisi Çalışma Saatleri',
            grade: 'all',
            content: 'Rehberlik servisimiz hafta içi 09:00-17:00 saatleri arasında hizmet vermektedir.',
            image: null,
            createdAt: '2024-01-13'
        }
    ]);

    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [editingContent, setEditingContent] = useState(null);
    const [viewingExam, setViewingExam] = useState(null);

    const handleSaveExam = (formData) => {
        if (editingExam) {
            setExams(exams.map(e => e.id === editingExam.id ? { ...e, ...formData } : e));
            toast.success('Sınav güncellendi');
        } else {
            setExams([...exams, { ...formData, id: Date.now(), createdAt: new Date().toISOString() }]);
            toast.success('Yeni sınav eklendi');
        }
        setEditingExam(null);
    };

    const handleDeleteExam = (id) => {
        if (window.confirm('Bu sınavı silmek istediğinize emin misiniz?')) {
            setExams(exams.filter(e => e.id !== id));
            toast.success('Sınav silindi');
        }
    };

    const handleSaveContent = (formData) => {
        if (editingContent) {
            setContents(contents.map(c => c.id === editingContent.id ? { ...c, ...formData } : c));
            toast.success('İçerik güncellendi');
        } else {
            setContents([...contents, { ...formData, id: Date.now(), createdAt: new Date().toISOString() }]);
            toast.success('Yeni içerik eklendi');
        }
        setEditingContent(null);
    };

    const handleDeleteContent = (id) => {
        if (window.confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
            setContents(contents.filter(c => c.id !== id));
            toast.success('İçerik silindi');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Rehberlik</h1>
                <p className="text-gray-500 mt-1">Sınav takvimi ve rehberlik içerikleri</p>
            </div>

            {/* Sınav Takvimi Bölümü */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="text-purple-600" />
                        Sınav Takvimi
                    </h2>
                    <Button size="sm" onClick={() => {
                        setEditingExam(null);
                        setIsExamModalOpen(true);
                    }}>
                        <Plus size={16} />
                        Sınav Ekle
                    </Button>
                </div>

                <div className="card">
                    <ExamList
                        exams={exams}
                        onView={(exam) => setViewingExam(exam)}
                        onEdit={(exam) => {
                            setEditingExam(exam);
                            setIsExamModalOpen(true);
                        }}
                        onDelete={handleDeleteExam}
                    />
                </div>
            </section>

            {/* Rehberlik İçerikleri Bölümü */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <BookOpen className="text-purple-600" />
                        Rehberlik İçerikleri
                    </h2>
                    <Button size="sm" onClick={() => {
                        setEditingContent(null);
                        setIsContentModalOpen(true);
                    }}>
                        <Plus size={16} />
                        Motivasyon ve Tavsiye Ekle
                    </Button>
                </div>

                <ContentGrid
                    contents={contents}
                    onEdit={(content) => {
                        setEditingContent(content);
                        setIsContentModalOpen(true);
                    }}
                    onDelete={handleDeleteContent}
                />
            </section>

            <ExamForm
                isOpen={isExamModalOpen}
                onClose={() => {
                    setIsExamModalOpen(false);
                    setEditingExam(null);
                }}
                onSave={handleSaveExam}
                initialData={editingExam}
            />

            <ContentForm
                isOpen={isContentModalOpen}
                onClose={() => {
                    setIsContentModalOpen(false);
                    setEditingContent(null);
                }}
                onSave={handleSaveContent}
                initialData={editingContent}
            />
        </div>
    );
};

export default Guidance;