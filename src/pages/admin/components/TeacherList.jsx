import React from 'react';
import { Eye, Edit2, Trash2, Mail, Video, Calendar, FileText } from 'lucide-react';
import Table from '../../../components/common/Table';

const TeacherList = ({
    teachers,
    contentCounts,
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

    const getAvatar = (teacher) => {
        const initial = teacher.firstName ? teacher.firstName.charAt(0) : '?';
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {initial}
            </div>
        );
    };

    // İçerik sayılarını gösteren bileşen
    const ContentCounter = ({ teacherId }) => {
        const counts = contentCounts(teacherId);
        const total = counts.videos + counts.liveLessons + counts.documents;

        if (total === 0) {
            return <span className="text-xs text-gray-400">İçerik yok</span>;
        }

        return (
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full w-fit">
                    {total} içerik
                </span>
                <div className="flex gap-2 text-xs text-gray-500">
                    {counts.videos > 0 && (
                        <span className="flex items-center gap-1" title="Video">
                            <Video size={12} /> {counts.videos}
                        </span>
                    )}
                    {counts.liveLessons > 0 && (
                        <span className="flex items-center gap-1" title="Canlı Ders">
                            <Calendar size={12} /> {counts.liveLessons}
                        </span>
                    )}
                    {counts.documents > 0 && (
                        <span className="flex items-center gap-1" title="Döküman">
                            <FileText size={12} /> {counts.documents}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const columns = [
        {
            key: 'select',
            title: (
                <input
                    type="checkbox"
                    onChange={(e) => onSelectAll(e.target.checked)}
                    checked={selectedItems.length === teachers.length && teachers.length > 0}
                    className="rounded border-gray-300"
                />
            ),
            sortable: false, // Sıralama devre dışı
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
            title: 'Öğretmen',
            sortable: false, // Karmaşık render edildiği için sıralama devre dışı (istersen name field'ı ayrı tutup sortable yapabilirsin)
            render: (_, teacher) => (
                <div className="flex items-center gap-3">
                    {getAvatar(teacher)}
                    <div>
                        <div className="font-medium text-gray-900">
                            {teacher.firstName} {teacher.lastName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail size={12} />
                            {teacher.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'grades',
            title: 'Kademe',
            render: (grades) => (
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {grades && grades.length > 0 ? (
                        grades.sort().map((grade) => (
                            <span
                                key={grade}
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                  ${parseInt(grade) <= 8 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                `}
                            >
                                {grade}. Sınıf
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">-</span>
                    )}
                </div>
            )
        },
        {
            key: 'content',
            title: 'İçerikler',
            sortable: false, // Karmaşık hesaplama olduğu için sıralama devre dışı
            render: (_, teacher) => <ContentCounter teacherId={teacher.id} />
        },
        {
            key: 'phone',
            title: 'Telefon',
            render: (phone) => phone || '-'
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
            sortable: false, // Sıralama devre dışı
            render: (_, teacher) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(teacher);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Görüntüle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(teacher);
                        }}
                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        title="Güncelle"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(teacher);
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
            data={teachers}
            emptyMessage="Öğretmen bulunamadı"
            itemsPerPage={5} // Sayfa başına 5 kayıt
            enableSorting={true}
        />
    );
};

export default TeacherList;