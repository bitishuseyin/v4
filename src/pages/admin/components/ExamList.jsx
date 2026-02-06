import React from 'react';
import { Eye, Edit2, Trash2, Calendar } from 'lucide-react';
import Table from '../../../components/common/Table';

const ExamList = ({ exams, onView, onEdit, onDelete }) => {
    const columns = [
        {
            key: 'title',
            title: 'Sınav Başlığı',
            render: (title) => (
                <div className="font-medium text-gray-900 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    {title}
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
        {
            key: 'date',
            title: 'Tarih',
            render: (date) => (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={14} />
                    {new Date(date).toLocaleDateString('tr-TR')}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'İşlemler',
            render: (_, exam) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(exam);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Görüntüle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(exam);
                        }}
                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        title="Güncelle"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(exam.id);
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

    return <Table columns={columns} data={exams} emptyMessage="Sınav bulunamadı" />;
};

export default ExamList;