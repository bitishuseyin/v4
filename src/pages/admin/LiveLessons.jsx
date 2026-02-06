import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import BulkActions from '../../components/common/BulkActions';
import LessonList from './components/LessonList';
import LessonForm from './components/LessonForm';
import LessonView from './components/LessonView';

const LiveLessons = () => {
    const [lessons, setLessons] = useState([
        {
            id: 1,
            topic: 'Türev Uygulamaları',
            grade: '12',
            subject: 'Matematik',
            teacher: 'Ahmet Öğretmen',
            date: '2024-02-15',
            time: '14:00',
            duration: '45',
            platform: 'zoom',
            link: 'https://zoom.us/j/123456789',
            status: 'active',
            createdAt: '2024-02-10'
        },
        {
            id: 2,
            topic: 'Atom Yapısı',
            grade: '9',
            subject: 'Kimya',
            teacher: 'Ayşe Öğretmen',
            date: '2024-02-16',
            time: '10:30',
            duration: '40',
            platform: 'meet',
            link: 'https://meet.google.com/abc-defg-hij',
            status: 'pending',
            createdAt: '2024-02-11'
        },
        {
            id: 3,
            topic: 'İkinci Derece Denklemler',
            grade: '10',
            subject: 'Matematik',
            teacher: 'Mehmet Öğretmen',
            date: '2024-02-14',
            time: '09:00',
            duration: '45',
            platform: 'teams',
            link: 'https://teams.microsoft.com/l/meetup-join/...',
            status: 'active',
            createdAt: '2024-02-09'
        }
    ]);

    const [filters, setFilters] = useState({
        search: '',
        grade: '',
        status: ''
    });

    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingLesson, setViewingLesson] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    // Toplu silme
    const handleBulkDelete = () => {
        if (window.confirm(`${selectedItems.length} canlı dersi silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz!`)) {
            setLessons(lessons.filter(l => !selectedItems.includes(l.id)));
            toast.success(`${selectedItems.length} canlı ders silindi`);
            setSelectedItems([]);
        }
    };

    // Toplu onaylama
    const handleBulkApprove = () => {
        const updatedLessons = lessons.map(l =>
            selectedItems.includes(l.id) && l.status === 'pending'
                ? { ...l, status: 'active' }
                : l
        );
        setLessons(updatedLessons);
        toast.success(`${selectedItems.length} canlı ders onaylandı ve aktif edildi`);
        setSelectedItems([]);
    };

    // Toplu dışa aktarma
    const handleBulkExport = () => {
        const selectedData = lessons.filter(l => selectedItems.includes(l.id));
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Konu,Sınıf,Öğretmen,Tarih,Saat,Platform,Durum\n"
            + selectedData.map(l => `${l.topic},${l.grade},${l.teacher},${l.date},${l.time},${l.platform},${l.status}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "canli_dersler.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${selectedData.length} canlı ders dışa aktarıldı`);
    };

    const filteredLessons = useMemo(() => {
        return lessons.filter(lesson => {
            const matchSearch = lesson.topic.toLowerCase().includes(filters.search.toLowerCase()) ||
                lesson.teacher.toLowerCase().includes(filters.search.toLowerCase());
            const matchGrade = !filters.grade || lesson.grade === filters.grade;
            const matchStatus = !filters.status || lesson.status === filters.status;
            return matchSearch && matchGrade && matchStatus;
        });
    }, [lessons, filters]);

    const handleSave = (formData) => {
        if (editingLesson) {
            const updatedLesson = {
                ...editingLesson,
                ...formData,
                status: formData.isActive ? 'active' : 'pending'
            };
            setLessons(lessons.map(l => l.id === editingLesson.id ? updatedLesson : l));
            toast.success('Canlı ders güncellendi');
        } else {
            const newLesson = {
                id: Date.now(),
                ...formData,
                teacher: 'Admin',
                createdAt: new Date().toISOString().split('T')[0],
                status: formData.isActive ? 'active' : 'pending'
            };
            setLessons([...lessons, newLesson]);
            toast.success('Yeni canlı ders eklendi');
        }
        setEditingLesson(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bu canlı dersi silmek istediğinize emin misiniz?')) {
            setLessons(lessons.filter(l => l.id !== id));
            setSelectedItems(prev => prev.filter(item => item !== id));
            toast.success('Canlı ders silindi');
        }
    };

    const handleApprove = (id) => {
        setLessons(lessons.map(l =>
            l.id === id ? { ...l, status: 'active' } : l
        ));
        toast.success('Canlı ders onaylandı ve aktif edildi');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Canlı Dersler</h1>
                    <p className="text-gray-500 mt-1">Canlı dersleri yönetin ve düzenleyin</p>
                </div>
                <Button onClick={() => {
                    setEditingLesson(null);
                    setIsModalOpen(true);
                }}>
                    <Plus size={20} /> Yeni Canlı Ders Ekle
                </Button>
            </div>

            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Ders veya öğretmen ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            icon={Search}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={filters.grade}
                            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                            options={[
                                { value: '9', label: '9. Sınıf' },
                                { value: '10', label: '10. Sınıf' },
                                { value: '11', label: '11. Sınıf' },
                                { value: '12', label: '12. Sınıf' }
                            ]}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            options={[
                                { value: 'active', label: 'Aktif' },
                                { value: 'pending', label: 'Onay Bekliyor' },
                                { value: 'passive', label: 'Pasif' }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-600">Toplam Ders</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{lessons.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Aktif</p>
                    <p className="text-2xl font-bold text-green-600">
                        {lessons.filter(l => l.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Onay Bekleyen</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {lessons.filter(l => l.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Seçili</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedItems.length}</p>
                </div>
            </div>

            {/* BULK ACTIONS */}
            <BulkActions
                selectedCount={selectedItems.length}
                onDelete={handleBulkDelete}
                onApprove={handleBulkApprove}
                onExport={handleBulkExport}
                showApprove={true}
                showReject={false}
                showExport={true}
            />

            <div className="card">
                <LessonList
                    lessons={filteredLessons}
                    onView={(lesson) => setViewingLesson(lesson)}
                    onEdit={(lesson) => {
                        setEditingLesson(lesson);
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onApprove={handleApprove}
                    selectedItems={selectedItems}
                    onSelectItem={(id, checked) => {
                        if (checked) setSelectedItems([...selectedItems, id]);
                        else setSelectedItems(selectedItems.filter(item => item !== id));
                    }}
                    onSelectAll={(checked) => setSelectedItems(checked ? filteredLessons.map(l => l.id) : [])}
                />
            </div>

            <LessonForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingLesson(null);
                }}
                onSave={handleSave}
                initialData={editingLesson}
            />

            <LessonView
                isOpen={!!viewingLesson}
                onClose={() => setViewingLesson(null)}
                lesson={viewingLesson}
            />
        </div>
    );
};

export default LiveLessons;