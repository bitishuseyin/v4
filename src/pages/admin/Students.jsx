import React, { useState, useMemo } from 'react';
import { Plus, Search, GraduationCap, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import BulkActions from '../../components/common/BulkActions';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentView from './components/StudentView';

const Students = () => {
    const [students, setStudents] = useState([
        {
            id: 1,
            firstName: 'Ali',
            lastName: 'Yılmaz',
            email: 'ali@student.com',
            phone: '0555 111 2233',
            parentPhone: '0555 999 8877',
            grade: '9',
            membershipStart: '2024-01-01',
            membershipEnd: '2025-01-01',
            notes: 'Matematik dersinde başarılı.',
            status: 'active',
            createdAt: '2024-01-10'
        },
        {
            id: 2,
            firstName: 'Ayşe',
            lastName: 'Demir',
            email: 'ayse@student.com',
            phone: '0555 222 3344',
            parentPhone: '0555 888 7766',
            grade: '10',
            membershipStart: '2023-09-15',
            membershipEnd: '2024-09-15',
            notes: '',
            status: 'active',
            createdAt: '2023-09-15'
        },
        {
            id: 3,
            firstName: 'Mehmet',
            lastName: 'Kaya',
            email: '',
            phone: '0555 333 4455',
            parentPhone: '0555 777 6655',
            grade: '12',
            membershipStart: '2024-02-01',
            membershipEnd: '2024-06-01',
            notes: 'YKS hazırlığı',
            status: 'active',
            createdAt: '2024-02-01'
        }
    ]);

    const [filters, setFilters] = useState({
        search: '',
        grade: '',
        status: ''
    });

    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingStudent, setViewingStudent] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);

    // Toplu silme
    const handleBulkDelete = () => {
        if (window.confirm(`${selectedItems.length} öğrenciyi silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz!`)) {
            setStudents(students.filter(s => !selectedItems.includes(s.id)));
            toast.success(`${selectedItems.length} öğrenci silindi`);
            setSelectedItems([]);
        }
    };

    // Toplu aktif/pasif yapma
    const handleBulkStatusChange = (newStatus) => {
        const updatedStudents = students.map(s =>
            selectedItems.includes(s.id) ? { ...s, status: newStatus } : s
        );
        setStudents(updatedStudents);
        toast.success(`${selectedItems.length} öğrenci ${newStatus === 'active' ? 'aktif' : 'pasif'} yapıldı`);
        setSelectedItems([]);
    };

    // Toplu dışa aktarma
    const handleBulkExport = () => {
        const selectedData = students.filter(s => selectedItems.includes(s.id));
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Ad,Soyad,Sınıf,E-posta,Veli Tel,Durum,Üyelik Bitiş\n"
            + selectedData.map(s => `${s.firstName},${s.lastName},${s.grade},${s.email || ''},${s.parentPhone || ''},${s.status},${s.membershipEnd}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ogrenciler.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${selectedData.length} öğrenci dışa aktarıldı`);
    };

    const handleSave = (formData) => {
        if (editingStudent) {
            const updatedStudent = {
                ...editingStudent,
                ...formData,
                status: formData.isActive ? 'active' : 'passive'
            };
            setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
            toast.success('Öğrenci güncellendi');
        } else {
            const newStudent = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString().split('T')[0],
                status: formData.isActive ? 'active' : 'passive'
            };
            setStudents([...students, newStudent]);
            toast.success('Yeni öğrenci eklendi');
        }
        setEditingStudent(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) {
            setStudents(students.filter(s => s.id !== id));
            setSelectedItems(prev => prev.filter(item => item !== id));
            toast.success('Öğrenci silindi');
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const matchSearch = fullName.includes(filters.search.toLowerCase()) ||
                (student.email && student.email.toLowerCase().includes(filters.search.toLowerCase()));
            const matchGrade = !filters.grade || student.grade === filters.grade;
            const matchStatus = !filters.status || student.status === filters.status;
            return matchSearch && matchGrade && matchStatus;
        });
    }, [students, filters]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Öğrenciler</h1>
                    <p className="text-gray-500 mt-1">Öğrencileri yönetin ve üyeliklerini takip edin</p>
                </div>
                <Button onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}>
                    <Plus size={20} /> Yeni Öğrenci Ekle
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
                        <GraduationCap size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-600">Toplam Öğrenci</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Aktif</p>
                    <p className="text-2xl font-bold text-green-600">
                        {students.filter(s => s.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Pasif</p>
                    <p className="text-2xl font-bold text-red-600">
                        {students.filter(s => s.status === 'passive').length}
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
                onApprove={() => handleBulkStatusChange('active')}
                onReject={() => handleBulkStatusChange('passive')}
                onExport={handleBulkExport}
                showApprove={true}
                showReject={true}
                showExport={true}
            />

            <div className="card">
                <StudentList
                    students={filteredStudents}
                    onView={setViewingStudent}
                    onEdit={(student) => { setEditingStudent(student); setIsModalOpen(true); }}
                    onDelete={handleDelete}
                    selectedItems={selectedItems}
                    onSelectItem={(id, checked) => {
                        if (checked) setSelectedItems([...selectedItems, id]);
                        else setSelectedItems(selectedItems.filter(item => item !== id));
                    }}
                    onSelectAll={(checked) => setSelectedItems(checked ? filteredStudents.map(s => s.id) : [])}
                />
            </div>

            <StudentForm
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingStudent(null); }}
                onSave={handleSave}
                initialData={editingStudent}
            />

            <StudentView
                isOpen={!!viewingStudent}
                onClose={() => setViewingStudent(null)}
                student={viewingStudent}
            />
        </div>
    );
};

export default Students;