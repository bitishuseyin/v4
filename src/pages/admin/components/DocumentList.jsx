import React from 'react';
import { Eye, Edit2, Trash2, Check, FileText } from 'lucide-react';
import Table from '../../../components/common/Table';

const DocumentList = ({
    documents,
    onView,
    onEdit,
    onDelete,
    onApprove,
    selectedItems,
    onSelectItem,
    onSelectAll
}) => {
    const getFileIcon = (type) => {
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            ppt: '📊',
            pptx: '📊'
        };
        return icons[type] || '📎';
    };

    const getStatusBadge = (status) => {
        const styles = {
            published: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };
        const labels = {
            published: 'Yayında',
            pending: 'Onay Bekliyor'
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
                    checked={selectedItems.length === documents.length && documents.length > 0}
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
            title: 'Döküman',
            render: (title, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {getFileIcon(row.fileType)}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]" title={title}>
                            {title}
                        </p>
                        <p className="text-xs text-gray-500">{row.fileType?.toUpperCase()}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'grade',
            title: 'Sınıf',
            render: (grade) => (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                    {grade}. Sınıf
                </span>
            )
        },
        { key: 'topic', title: 'Konu' },
        { key: 'uploader', title: 'Yükleyen' },
        {
            key: 'uploadDate',
            title: 'Kayıt Tarihi',
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
            data={documents}
            emptyMessage="Döküman bulunamadı"
            itemsPerPage={5}
            enableSorting={true}
        />
    );
};

export default DocumentList;