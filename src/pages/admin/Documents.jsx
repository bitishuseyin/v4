import React, { useState, useMemo } from 'react';
import { Plus, Search, FileText, AlertTriangle, Video, Calendar, CheckCircle, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import BulkActions from '../../components/common/BulkActions';
import Modal from '../../components/common/Modal';
import DocumentList from './components/DocumentList';
import DocumentForm from './components/DocumentForm';
import DocumentView from './components/DocumentView';

const Documents = () => {
    const [documents, setDocuments] = useState([
        {
            id: 1,
            title: '9. Sınıf Matematik Konu Anlatımı',
            grade: '9',
            topic: 'Fonksiyonlar',
            uploader: 'Ahmet Öğretmen',
            fileName: '9_sinif_fonksiyonlar.pdf',
            fileType: 'pdf',
            fileSize: 2048576,
            uploadDate: '2024-01-15',
            status: 'published',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            title: '10. Sınıf Fizik Laboratuvar Kılavuzu',
            grade: '10',
            topic: 'Fizik Temelleri',
            uploader: 'Ayşe Öğretmen',
            fileName: 'fizik_lab.docx',
            fileType: 'docx',
            fileSize: 1024000,
            uploadDate: '2024-01-14',
            status: 'pending',
            createdAt: '2024-01-14'
        },
        {
            id: 3,
            title: 'YKS Hazırlık Sunumu',
            grade: '12',
            topic: 'YKS Hazırlık',
            uploader: 'Mehmet Öğretmen',
            fileName: 'yks_strateji.pptx',
            fileType: 'pptx',
            fileSize: 5120000,
            uploadDate: '2024-01-13',
            status: 'published',
            createdAt: '2024-01-13'
        },
        {
            id: 4,
            title: '11. Sınıf Kimya Notları',
            grade: '11',
            topic: 'Kimya',
            uploader: 'Fatma Öğretmen',
            fileName: 'kimya_notlar.pdf',
            fileType: 'pdf',
            fileSize: 3145728,
            uploadDate: '2024-01-12',
            status: 'published',
            createdAt: '2024-01-12'
        }
    ]);

    const [filters, setFilters] = useState({
        search: '',
        grade: '',
        status: ''
    });

    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingDocument, setViewingDocument] = useState(null);
    const [editingDocument, setEditingDocument] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchSearch = doc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                doc.uploader.toLowerCase().includes(filters.search.toLowerCase());
            const matchGrade = !filters.grade || doc.grade === filters.grade;
            const matchStatus = !filters.status || doc.status === filters.status;
            return matchSearch && matchGrade && matchStatus;
        });
    }, [documents, filters]);

    // Toplu silme
    const handleBulkDelete = () => {
        const selectedDocs = documents.filter(d => selectedItems.includes(d.id));
        const publishedCount = selectedDocs.filter(d => d.status === 'published').length;

        let message = `${selectedItems.length} dökümanı silmek istediğinize emin misiniz?`;
        if (publishedCount > 0) {
            message += `\n\n${publishedCount} adet yayında olan döküman var. Bu dökümanlara öğrenciler erişemeyecek!`;
        }

        if (window.confirm(message)) {
            setDocuments(documents.filter(d => !selectedItems.includes(d.id)));
            setSelectedItems([]);
            toast.success(`${selectedItems.length} döküman silindi`);
        }
    };

    // Toplu onaylama
    const handleBulkApprove = () => {
        const updatedDocs = documents.map(doc =>
            selectedItems.includes(doc.id) ? { ...doc, status: 'published' } : doc
        );
        setDocuments(updatedDocs);
        toast.success(`${selectedItems.length} döküman onaylandı ve yayınlandı`);
        setSelectedItems([]);
    };

    // Toplu dışa aktarma
    const handleBulkExport = () => {
        const selectedData = documents.filter(d => selectedItems.includes(d.id));
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Başlık,Sınıf,Konu,Yükleyen,Durum,Yükleme Tarihi\n"
            + selectedData.map(d =>
                `"${d.title}",${d.grade}. Sınıf,${d.topic},${d.uploader},${d.status === 'published' ? 'Yayında' : 'Onay Bekliyor'},${new Date(d.uploadDate).toLocaleDateString('tr-TR')}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dokumanlar.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${selectedData.length} döküman dışa aktarıldı`);
    };

    const handleSave = (formData) => {
        if (editingDocument) {
            const updatedDoc = {
                ...editingDocument,
                ...formData,
                status: formData.isPublished ? 'published' : 'pending',
                fileName: formData.file?.name || editingDocument.fileName,
                fileType: formData.file?.type || editingDocument.fileType,
                fileSize: formData.file?.size || editingDocument.fileSize
            };
            setDocuments(documents.map(d => d.id === editingDocument.id ? updatedDoc : d));
            toast.success(formData.isPublished ? 'Döküman güncellendi ve yayınlandı' : 'Döküman güncellendi (Onay bekliyor)');
        } else {
            const newDoc = {
                id: Date.now(),
                ...formData,
                uploader: 'Admin',
                uploadDate: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString().split('T')[0],
                status: formData.isPublished ? 'published' : 'pending',
                fileName: formData.file?.name,
                fileType: formData.file?.type,
                fileSize: formData.file?.size
            };
            setDocuments([...documents, newDoc]);
            toast.success(formData.isPublished ? 'Döküman eklendi ve yayınlandı' : 'Döküman eklendi (Onay bekliyor)');
        }
        setEditingDocument(null);
    };

    const handleDelete = (id) => {
        const doc = documents.find(d => d.id === id);
        if (doc?.status === 'published') {
            setDeleteConfirm(doc);
        } else {
            if (window.confirm('Bu dökümanı silmek istediğinize emin misiniz?')) {
                executeDelete(id);
            }
        }
    };

    const executeDelete = (id) => {
        setDocuments(documents.filter(d => d.id !== id));
        setSelectedItems(prev => prev.filter(item => item !== id));
        toast.success('Döküman silindi');
        setDeleteConfirm(null);
    };

    const handleApprove = (id) => {
        setDocuments(documents.map(d =>
            d.id === id ? { ...d, status: 'published', publishDate: new Date().toISOString().split('T')[0] } : d
        ));
        toast.success('Döküman onaylandı ve yayınlandı');
    };

    const publishedCount = documents.filter(d => d.status === 'published').length;
    const pendingCount = documents.filter(d => d.status === 'pending').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dökümanlar</h1>
                    <p className="text-gray-500 mt-1">PDF, Word ve PowerPoint dökümanlarını yönetin</p>
                </div>
                <Button onClick={() => {
                    setEditingDocument(null);
                    setIsModalOpen(true);
                }}>
                    <Plus size={20} />
                    Yeni Döküman Ekle
                </Button>
            </div>

            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Döküman veya yükleyen ara..."
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
                                { value: 'pending', label: 'Onay Bekliyor' }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-600">Toplam Döküman</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{documents.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Yayında</p>
                    <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Onay Bekleyen</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
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
                <DocumentList
                    documents={filteredDocuments}
                    onView={(doc) => setViewingDocument(doc)}
                    onEdit={(doc) => {
                        setEditingDocument(doc);
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onApprove={handleApprove}
                    selectedItems={selectedItems}
                    onSelectItem={(id, checked) => {
                        if (checked) setSelectedItems([...selectedItems, id]);
                        else setSelectedItems(selectedItems.filter(item => item !== id));
                    }}
                    onSelectAll={(checked) => setSelectedItems(checked ? filteredDocuments.map(d => d.id) : [])}
                />
            </div>

            {/* Yayında olan döküman silme uyarısı */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title={
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={24} />
                        <span>Yayında Olan Döküman Siliniyor</span>
                    </div>
                }
                size="sm"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-gray-800 font-medium mb-2">
                            "{deleteConfirm?.title}"
                        </p>
                        <p className="text-sm text-gray-600">
                            Bu döküman şu anda <strong>yayında</strong>. Silindiğinde öğrenciler erişemeyecek!
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                            İptal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => executeDelete(deleteConfirm.id)}
                        >
                            Yine de Sil
                        </Button>
                    </div>
                </div>
            </Modal>

            <DocumentForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingDocument(null);
                }}
                onSave={handleSave}
                initialData={editingDocument}
            />

            <DocumentView
                isOpen={!!viewingDocument}
                onClose={() => setViewingDocument(null)}
                document={viewingDocument}
            />
        </div>
    );
};

export default Documents;