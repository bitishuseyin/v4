import React, { useState, useMemo } from 'react';
import { Plus, Search, Video } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import BulkActions from '../../components/common/BulkActions';
import VideoList from './components/VideoList';
import VideoForm from './components/VideoForm';
import VideoView from './components/VideoView';

const Videos = () => {
    const [videos, setVideos] = useState([
        {
            id: 1,
            title: '9. Sınıf Matematik - Fonksiyonlar',
            grade: '9',
            topic: 'Fonksiyonlar',
            uploader: 'Ahmet Öğretmen',
            uploadDate: '2024-01-15',
            publishDate: '2024-01-16',
            status: 'published',
            description: 'Temel fonksiyon kavramları'
        },
        {
            id: 2,
            title: '10. Sınıf Fizik - Kuvvet',
            grade: '10',
            topic: 'Fizik Temelleri',
            uploader: 'Ayşe Öğretmen',
            uploadDate: '2024-01-14',
            publishDate: null,
            status: 'pending',
            description: 'Newton kanunları'
        },
        {
            id: 3,
            title: '11. Sınıf Kimya - Asitler',
            grade: '11',
            topic: 'Kimya',
            uploader: 'Mehmet Öğretmen',
            uploadDate: '2024-01-13',
            publishDate: '2024-01-13',
            status: 'published',
            description: 'Asit-baz dengesi'
        }
    ]);

    const [filters, setFilters] = useState({
        search: '',
        grade: '',
        status: ''
    });

    const [subjects, setSubjects] = useState({
        '9': [{ name: 'Fonksiyonlar' }, { name: 'Geometri' }],
        '10': [{ name: 'Türev' }, { name: 'Fizik' }]
        // ... veya Curriculum'dan gelen veri
    });

    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingVideo, setViewingVideo] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);

    // Toplu silme
    const handleBulkDelete = () => {
        if (window.confirm(`${selectedItems.length} videoyu silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz!`)) {
            setVideos(videos.filter(v => !selectedItems.includes(v.id)));
            toast.success(`${selectedItems.length} video silindi`);
            setSelectedItems([]);
        }
    };

    // Toplu onaylama
    const handleBulkApprove = () => {
        const updatedVideos = videos.map(v =>
            selectedItems.includes(v.id) && v.status === 'pending'
                ? { ...v, status: 'published', publishDate: new Date().toISOString().split('T')[0] }
                : v
        );
        setVideos(updatedVideos);
        toast.success(`${selectedItems.length} video onaylandı ve yayınlandı`);
        setSelectedItems([]);
    };

    // Toplu dışa aktarma
    const handleBulkExport = () => {
        const selectedData = videos.filter(v => selectedItems.includes(v.id));
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Başlık,Sınıf,Konu,Yükleyen,Durum,Yükleme Tarihi\n"
            + selectedData.map(v => `${v.title},${v.grade},${v.topic},${v.uploader},${v.status},${v.uploadDate}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "videolar.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${selectedData.length} video dışa aktarıldı`);
    };

    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
            const matchSearch = video.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                video.uploader.toLowerCase().includes(filters.search.toLowerCase());
            const matchGrade = !filters.grade || video.grade === filters.grade;
            const matchStatus = !filters.status || video.status === filters.status;
            return matchSearch && matchGrade && matchStatus;
        });
    }, [videos, filters]);

    const handleSave = (formData) => {
        if (editingVideo) {
            const updatedVideo = {
                ...editingVideo,
                ...formData,
                status: formData.isPublished ? 'published' : 'pending',
                publishDate: formData.isPublished ? (editingVideo.publishDate || new Date().toISOString().split('T')[0]) : null
            };
            setVideos(videos.map(v => v.id === editingVideo.id ? updatedVideo : v));
            toast.success(formData.isPublished ? 'Video güncellendi ve yayınlandı' : 'Video güncellendi (Onay bekliyor)');
        } else {
            const newVideo = {
                id: Date.now(),
                ...formData,
                uploader: 'Admin',
                uploadDate: new Date().toISOString().split('T')[0],
                status: formData.isPublished ? 'published' : 'pending',
                publishDate: formData.isPublished ? new Date().toISOString().split('T')[0] : null
            };
            setVideos([...videos, newVideo]);
            toast.success(formData.isPublished ? 'Video eklendi ve yayınlandı' : 'Video eklendi (Onay bekliyor)');
        }
        setEditingVideo(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bu videoyu silmek istediğinize emin misiniz?')) {
            setVideos(videos.filter(v => v.id !== id));
            setSelectedItems(prev => prev.filter(item => item !== id));
            toast.success('Video silindi');
        }
    };

    const handleApprove = (id) => {
        setVideos(videos.map(v =>
            v.id === id ? { ...v, status: 'published', publishDate: new Date().toISOString().split('T')[0] } : v
        ));
        toast.success('Video onaylandı ve yayınlandı');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Video Yönetimi</h1>
                    <p className="text-gray-500 mt-1">Videoları yönetin, onaylayın ve düzenleyin</p>
                </div>
                <Button onClick={() => {
                    setEditingVideo(null);
                    setIsModalOpen(true);
                }}>
                    <Plus size={20} /> Yeni Video Ekle
                </Button>
            </div>

            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Video veya yükleyen ara..."
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
                                { value: 'published', label: 'Yayında' },
                                { value: 'pending', label: 'Onay Bekliyor' },
                                { value: 'draft', label: 'Taslak' }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Video size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-600">Toplam Video</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Yayında</p>
                    <p className="text-2xl font-bold text-green-600">
                        {videos.filter(v => v.status === 'published').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Onay Bekleyen</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {videos.filter(v => v.status === 'pending').length}
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
                <VideoList
                    videos={filteredVideos}
                    onView={(video) => setViewingVideo(video)}
                    onEdit={(video) => {
                        setEditingVideo(video);
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onApprove={handleApprove}
                    selectedItems={selectedItems}
                    onSelectItem={(id, checked) => {
                        if (checked) setSelectedItems([...selectedItems, id]);
                        else setSelectedItems(selectedItems.filter(item => item !== id));
                    }}
                    onSelectAll={(checked) => setSelectedItems(checked ? filteredVideos.map(v => v.id) : [])}
                />
            </div>

            <VideoForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingVideo(null);
                }}
                onSave={handleSave}
                initialData={editingVideo}
                subjects={subjects}
            />

            <VideoView
                isOpen={!!viewingVideo}
                onClose={() => setViewingVideo(null)}
                video={viewingVideo}
            />
        </div>
    );
};

export default Videos;