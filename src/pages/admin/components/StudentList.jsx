import React from 'react';
import { Eye, Edit2, Trash2, Mail, AlertCircle } from 'lucide-react';
import Table from '../../../components/common/Table';

const StudentList = ({
    students,
    onView,
    onEdit,
    onDelete,
    selectedItems,
    onSelectItem,
    onSelectAll
}) => {
    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800 border-green-200',
            passive: 'bg-red-100 text-red-800 border-red-200'
        };
        const labels = {
            active: 'Aktif',
            passive: 'Pasif'
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getAvatar = (student) => {
        const initial = student.firstName ? student.firstName.charAt(0) : '?';
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                {initial}
            </div>
        );
    };

    const isMembershipExpiringSoon = (endDate) => {
        if (!endDate) return false;
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
    };

    const columns = [
        {
            key: 'select',
            title: (
                <input
                    type="checkbox"
                    onChange={(e) => onSelectAll(e.target.checked)}
                    checked={selectedItems.length === students.length && students.length > 0}
                    className="rounded border-gray-300"
                />
            ),
            sortable: false,
            render: (_, row) => (
                <input
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={(e) => onSelectItem(row.id, e.target.checked)}
                    className="rounded border-gray-300"
                />
            )
        },
        {
            key: 'name',
            title: 'Öğrenci',
            sortable: false,
            render: (_, student) => (
                <div className="flex items-center gap-3">
                    {getAvatar(student)}
                    <div>
                        <div className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail size={12} />
                            {student.email || 'E-posta yok'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'grade',
            title: 'Sınıf',
            render: (grade) => (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {grade}. Sınıf
                </span>
            )
        },
        {
            key: 'parentPhone',
            title: 'Veli Tel',
            render: (phone) => phone || '-'
        },
        {
            key: 'membershipEnd',
            title: 'Üyelik Bitiş',
            render: (date, student) => {
                const expiringSoon = isMembershipExpiringSoon(date);
                return (
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-600">
                            {new Date(date).toLocaleDateString('tr-TR')}
                        </span>
                        {expiringSoon && (
                            <span className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} />
                                Yakında
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'status',
            title: 'Durum',
            render: (status) => getStatusBadge(status)
        },
        {
            key: 'createdAt',
            title: 'Kayıt Tarihi',
            render: (date) => new Date(date).toLocaleDateString('tr-TR')
        },
        {
            key: 'actions',
            title: 'İşlemler',
            sortable: false,
            render: (_, student) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(student);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Görüntüle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(student);
                        }}
                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        title="Güncelle"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(student.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Sil"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            data={students}
            emptyMessage="Öğrenci bulunamadı"
            itemsPerPage={5}
            enableSorting={true}
        />
    );
};

export default StudentList;