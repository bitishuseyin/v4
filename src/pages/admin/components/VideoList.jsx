import React from 'react';
import { Eye, Edit2, Trash2, Check, Clock } from 'lucide-react';
import Table from '../../../components/common/Table';

const VideoList = ({
    videos,
    onView,
    onEdit,
    onDelete,
    onApprove,
    selectedItems,
    onSelectItem,
    onSelectAll
}) => {
    const getStatusBadge = (status) => {
        const styles = {
            published: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            draft: 'bg-gray-100 text-gray-800'
        };
        const labels = {
            published: 'Yayında',
            pending: 'Onay Bekliyor',
            draft: 'Taslak'
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
                    checked={selectedItems.length === videos.length && videos.length > 0}
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
            key: 'title',
            title: 'Video Adı',
            render: (title) => (
                <div className="font-medium text-gray-900 max-w-[200px] truncate" title={title}>
                    {title}
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
        { key: 'topic', title: 'Konu' },
        { key: 'uploader', title: 'Yükleyen' },
        {
            key: 'uploadDate',
            title: 'Yükleme Tarihi',
            render: (date) => new Date(date).toLocaleDateString('tr-TR')
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
            data={videos}
            emptyMessage="Video bulunamadı"
            itemsPerPage={5}
            enableSorting={true}
        />
    );
};

export default VideoList;