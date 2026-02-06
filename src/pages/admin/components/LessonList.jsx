import React from 'react';
import { Eye, Edit2, Trash2, Check, Calendar, Clock } from 'lucide-react';
import Table from '../../../components/common/Table';

const LessonList = ({
    lessons,
    onView,
    onEdit,
    onDelete,
    onApprove,
    selectedItems,
    onSelectItem,
    onSelectAll
}) => {
    const getPlatformBadge = (platform) => {
        const styles = {
            zoom: 'bg-blue-100 text-blue-800',
            meet: 'bg-green-100 text-green-800',
            teams: 'bg-purple-100 text-purple-800'
        };
        const labels = {
            zoom: 'Zoom',
            meet: 'Meet',
            teams: 'Teams'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[platform]}`}>
                {labels[platform]}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            passive: 'bg-gray-100 text-gray-800'
        };
        const labels = {
            active: 'Aktif',
            pending: 'Onay Bekliyor',
            passive: 'Pasif'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const columns = [
        {
            key: 'select',
            title: (
                <input
                    type="checkbox"
                    onChange={(e) => onSelectAll(e.target.checked)}
                    checked={selectedItems.length === lessons.length && lessons.length > 0}
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
            key: 'topic',
            title: 'Ders Konusu',
            render: (topic) => (
                <div className="font-medium text-gray-900 max-w-[200px] truncate" title={topic}>
                    {topic}
                </div>
            )
        },
        {
            key: 'grade',
            title: 'Sınıf',
            render: (grade) => (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {grade}. Sınıf
                </span>
            )
        },
        { key: 'uploader', title: 'Öğretmen' },
        {
            key: 'date',
            title: 'Tarih/Saat',
            render: (date, row) => (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                        <Calendar size={14} />
                        {new Date(date).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <Clock size={14} />
                        {row.time} ({row.duration} dk)
                    </span>
                </div>
            )
        },
        {
            key: 'platform',
            title: 'Platform',
            render: (platform) => getPlatformBadge(platform)
        },
        {
            key: 'status',
            title: 'Durum',
            render: (status, row) => (
                <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    {status === 'pending' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onApprove(row.id);
                            }}
                            className="p-1 hover:bg-green-100 rounded text-green-600"
                            title="Onayla"
                        >
                            <Check size={16} />
                        </button>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'İşlemler',
            sortable: false,
            render: (_, row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Görüntüle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                        }}
                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        title="Güncelle"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row.id);
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
            data={lessons}
            emptyMessage="Canlı ders bulunamadı"
            itemsPerPage={5}
            enableSorting={true}
        />
    );
};

export default LessonList;