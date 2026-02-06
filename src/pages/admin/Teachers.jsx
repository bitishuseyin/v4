import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, AlertTriangle, Video, Calendar, FileText, UserX, UserCheck, ArrowRightLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import BulkActions from '../../components/common/BulkActions';
import Modal from '../../components/common/Modal';
import TeacherList from './components/TeacherList';
import TeacherForm from './components/TeacherForm';
import TeacherView from './components/TeacherView';

const Teachers = () => {
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet.yilmaz@okul.com',
            phone: '0555 123 4567',
            grades: ['9', '10'],
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            firstName: 'Ayşe',
            lastName: 'Demir',
            email: 'ayse.demir@okul.com',
            phone: '0555 987 6543',
            grades: ['11', '12'],
            status: 'active',
            createdAt: '2024-01-14'
        },
        {
            id: 3,
            firstName: 'Mehmet',
            lastName: 'Kaya',
            email: 'mehmet.kaya@okul.com',
            phone: '0555 456 7890',
            grades: ['5', '6'],
            status: 'active',
            createdAt: '2024-01-10'
        },
        {
            id: 4,
            firstName: 'Fatma',
            lastName: 'Şahin',
            email: 'fatma.sahin@okul.com',
            phone: '0555 111 2222',
            grades: ['7', '8'],
            status: 'passive',
            createdAt: '2024-01-08'
        },
        {
            id: 5,
            firstName: 'Ali',
            lastName: 'Yıldız',
            email: 'ali.yildiz@okul.com',
            phone: '0555 333 4444',
            grades: ['9'],
            status: 'active',
            createdAt: '2024-01-05'
        }
    ]);

    // İçerikler
    const [contents, setContents] = useState({
        videos: [
            { id: 1, title: 'Fonksiyonlar 1', teacherId: 1 },
            { id: 2, title: 'Türev Uygulamaları', teacherId: 1 },
            { id: 3, title: 'Kimya Temelleri', teacherId: 2 }
        ],
        liveLessons: [
            { id: 1, topic: 'Canlı Ders 1', teacherId: 1 },
            { id: 2, topic: 'Canlı Ders 2', teacherId: 2 }
        ],
        documents: [
            { id: 1, title: 'PDF 1', teacherId: 1 }
        ]
    });

    const [filters, setFilters] = useState({
        search: '',
        grade: '',
        status: ''
    });

    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingTeacher, setViewingTeacher] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteMode, setDeleteMode] = useState('keep');
    const [transferModal, setTransferModal] = useState(false);
    const [selectedTargetTeacher, setSelectedTargetTeacher] = useState('');

    const getContentCounts = (teacherId) => {
        return {
            videos: contents.videos.filter(v => v.teacherId === teacherId).length,
            liveLessons: contents.liveLessons.filter(l => l.teacherId === teacherId).length,
            documents: contents.documents.filter(d => d.teacherId === teacherId).length
        };
    };

    const hasContent = (counts) => {
        return counts.videos > 0 || counts.liveLessons > 0 || counts.documents > 0;
    };

    // Toplu silme fonksiyonu
    const handleBulkDelete = () => {
        const selectedTeachers = teachers.filter(t => selectedItems.includes(t.id));
        const totalContent = selectedTeachers.reduce((acc, teacher) => {
            const counts = getContentCounts(teacher.id);
            return acc + counts.videos + counts.liveLessons + counts.documents;
        }, 0);

        let message = `${selectedItems.length} öğretmeni silmek istediğinize emin misiniz?`;
        if (totalContent > 0) {
            message += `\n\n${totalContent} adet içerik etkilenecektir. İçerikler "Bilinmeyen Öğretmen" olarak kalacaktır.`;
        }

        if (window.confirm(message)) {
            // Silme işlemi
            selectedItems.forEach(id => {
                const teacher = teachers.find(t => t.id === id);
                if (teacher) {
                    // İçerikleri koru (teacherId'yi null yap veya sil)
                    // Gerçek projede burada API çağrısı olacak
                }
            });

            setTeachers(teachers.filter(t => !selectedItems.includes(t.id)));
            setSelectedItems([]);
            toast.success(`${selectedItems.length} öğretmen silindi`);
        }
    };

    // Toplu dışa aktarma
    const handleBulkExport = () => {
        const selectedData = teachers.filter(t => selectedItems.includes(t.id));
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Ad,Soyad,Email,Telefon,Durum\n"
            + selectedData.map(t => `${t.firstName},${t.lastName},${t.email},${t.phone},${t.status}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ogretmenler.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${selectedData.length} öğretmen dışa aktarıldı`);
    };

    const handleDelete = (teacher) => {
        const counts = getContentCounts(teacher.id);

        if (hasContent(counts)) {
            setDeleteConfirm({ teacher, counts });
            setDeleteMode('keep');
            setSelectedTargetTeacher('');
        } else {
            if (window.confirm(`"${teacher.firstName} ${teacher.lastName}" silinecek. Emin misiniz?`)) {
                executeDelete(teacher.id, false);
            }
        }
    };

    const executeDelete = (teacherId, deleteContents, targetTeacherId = null) => {
        if (targetTeacherId) {
            const targetTeacher = teachers.find(t => t.id === targetTeacherId);
            toast.success(`Tüm içerikler ${targetTeacher.firstName} ${targetTeacher.lastName}'ye devredildi`);
        } else if (deleteContents) {
            toast.success('Öğretmen ve tüm içerikleri silindi');
        }

        setTeachers(teachers.filter(t => t.id !== teacherId));
        setSelectedItems(prev => prev.filter(id => id !== teacherId)); // Seçili listeden de çıkar
        setDeleteConfirm(null);
        setTransferModal(false);
    };

    const handleTransfer = () => {
        if (!selectedTargetTeacher) {
            toast.error('Lütfen bir öğretmen seçin');
            return;
        }
        executeDelete(deleteConfirm.teacher.id, false, parseInt(selectedTargetTeacher));
    };

    const handleSave = (formData) => {
        if (editingTeacher) {
            const updated = {
                ...editingTeacher,
                ...formData,
                status: formData.isActive ? 'active' : 'passive'
            };
            setTeachers(teachers.map(t => t.id === editingTeacher.id ? updated : t));
            toast.success('Öğretmen güncellendi');
        } else {
            const newTeacher = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString().split('T')[0],
                status: formData.isActive ? 'active' : 'passive'
            };
            setTeachers([...teachers, newTeacher]);
            toast.success('Yeni öğretmen eklendi');
        }
        setEditingTeacher(null);
    };

    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
            const matchSearch = fullName.includes(filters.search.toLowerCase()) ||
                teacher.email.toLowerCase().includes(filters.search.toLowerCase());
            const matchGrade = !filters.grade || teacher.grades.includes(filters.grade);
            const matchStatus = !filters.status || teacher.status === filters.status;
            return matchSearch && matchGrade && matchStatus;
        });
    }, [teachers, filters]);

    const getAvailableTeachersForTransfer = (excludeId) => {
        return teachers.filter(t => t.id !== excludeId && t.status === 'active');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Öğretmenler</h1>
                    <p className="text-gray-500 mt-1">Öğretmenleri yönetin ve içeriklerini takip edin</p>
                </div>
                <Button onClick={() => { setEditingTeacher(null); setIsModalOpen(true); }}>
                    <Plus size={20} /> Yeni Öğretmen Ekle
                </Button>
            </div>

            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="İsim, soyisim veya e-posta ara..."
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
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            options={[
                                { value: 'active', label: 'Aktif' },
                                { value: 'passive', label: 'Pasif' }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-600">Toplam Öğretmen</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Aktif</p>
                    <p className="text-2xl font-bold text-green-600">
                        {teachers.filter(t => t.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Video size={18} className="text-blue-400" />
                        <p className="text-sm text-gray-600">Toplam Video</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{contents.videos.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Pasif</p>
                    <p className="text-2xl font-bold text-red-600">
                        {teachers.filter(t => t.status === 'passive').length}
                    </p>
                </div>
            </div>

            {/* BULK ACTIONS - LİSTENİN ÜSTÜNE EKLENDİ */}
            <BulkActions
                selectedCount={selectedItems.length}
                onDelete={handleBulkDelete}
                onExport={handleBulkExport}
                showApprove={false}
                showReject={false}
                showExport={true}
            />

            <div className="card">
                <TeacherList
                    teachers={filteredTeachers}
                    contentCounts={getContentCounts}
                    onView={setViewingTeacher}
                    onEdit={(teacher) => { setEditingTeacher(teacher); setIsModalOpen(true); }}
                    onDelete={handleDelete}
                    selectedItems={selectedItems}
                    onSelectItem={(id, checked) => {
                        if (checked) setSelectedItems([...selectedItems, id]);
                        else setSelectedItems(selectedItems.filter(item => item !== id));
                    }}
                    onSelectAll={(checked) => setSelectedItems(checked ? filteredTeachers.map(t => t.id) : [])}
                />
            </div>

            {/* Modallar aynı kalıyor... */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title={
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={24} />
                        <span>Öğretmen Silme - İçerik Uyarısı</span>
                    </div>
                }
                size="md"
            >
                {/* Modal içeriği öncekiyle aynı... */}
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-gray-800 font-medium mb-2">
                            "{deleteConfirm?.teacher.firstName} {deleteConfirm?.teacher.lastName}" silmek üzeresiniz.
                        </p>
                        <div className="space-y-2">
                            {deleteConfirm?.counts.videos > 0 && (
                                <div className="flex items-center gap-2 text-red-700 bg-white p-2 rounded border border-red-100">
                                    <Video size={18} />
                                    <span className="font-bold">{deleteConfirm.counts.videos}</span>
                                    <span>Video</span>
                                </div>
                            )}
                            {deleteConfirm?.counts.liveLessons > 0 && (
                                <div className="flex items-center gap-2 text-red-700 bg-white p-2 rounded border border-red-100">
                                    <Calendar size={18} />
                                    <span className="font-bold">{deleteConfirm.counts.liveLessons}</span>
                                    <span>Canlı Ders</span>
                                </div>
                            )}
                            {deleteConfirm?.counts.documents > 0 && (
                                <div className="flex items-center gap-2 text-red-700 bg-white p-2 rounded border border-red-100">
                                    <FileText size={18} />
                                    <span className="font-bold">{deleteConfirm.counts.documents}</span>
                                    <span>Döküman</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer ${deleteMode === 'transfer' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                            <input type="radio" name="deleteMode" value="transfer" checked={deleteMode === 'transfer'} onChange={(e) => setDeleteMode(e.target.value)} className="mt-1" />
                            <div>
                                <div className="font-medium">Başka Öğretmene Devret</div>
                                <p className="text-sm text-gray-500">İçerikler başka öğretmene aktarılır</p>
                            </div>
                        </label>
                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer ${deleteMode === 'keep' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="deleteMode" value="keep" checked={deleteMode === 'keep'} onChange={(e) => setDeleteMode(e.target.value)} className="mt-1" />
                            <div>
                                <div className="font-medium">İçerikleri Koru</div>
                                <p className="text-sm text-gray-500">Bilinmeyen Öğretmen olarak kal</p>
                            </div>
                        </label>
                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer ${deleteMode === 'delete' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                            <input type="radio" name="deleteMode" value="delete" checked={deleteMode === 'delete'} onChange={(e) => setDeleteMode(e.target.value)} className="mt-1" />
                            <div>
                                <div className="font-medium text-red-700">İçerikleri de Sil</div>
                                <p className="text-sm text-gray-500">Her şey silinsin</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>İptal</Button>
                        {deleteMode === 'transfer' ? (
                            <Button onClick={() => setTransferModal(true)} className="bg-purple-600">Devam Et</Button>
                        ) : (
                            <Button variant={deleteMode === 'delete' ? 'danger' : 'primary'} onClick={() => executeDelete(deleteConfirm.teacher.id, deleteMode === 'delete')}>
                                {deleteMode === 'delete' ? 'Hepsini Sil' : 'Öğretmeni Sil'}
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={transferModal} onClose={() => setTransferModal(false)} title="İçerikleri Devret" size="sm">
                <div className="space-y-4">
                    <select
                        value={selectedTargetTeacher}
                        onChange={(e) => setSelectedTargetTeacher(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Öğretmen seçin...</option>
                        {deleteConfirm && getAvailableTeachersForTransfer(deleteConfirm.teacher.id).map(t => (
                            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setTransferModal(false)}>Geri</Button>
                        <Button onClick={handleTransfer} disabled={!selectedTargetTeacher} className="bg-purple-600">Devret ve Sil</Button>
                    </div>
                </div>
            </Modal>

            <TeacherForm isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTeacher(null); }} onSave={handleSave} initialData={editingTeacher} />
            <TeacherView isOpen={!!viewingTeacher} onClose={() => setViewingTeacher(null)} teacher={viewingTeacher} />
        </div>
    );
};

export default Teachers;