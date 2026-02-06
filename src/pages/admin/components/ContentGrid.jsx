import React from 'react';
import { Edit2, Trash2, BookOpen } from 'lucide-react';
import Button from '../../../components/common/Button';

const ContentGrid = ({ contents, onEdit, onDelete }) => {
    const getTypeStyles = (type) => {
        switch (type) {
            case 'motivation':
                return { label: 'Motivasyon', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: '💪' };
            case 'advice':
                return { label: 'Tavsiye', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', icon: '💡' };
            case 'announcement':
                return { label: 'Duyuru', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: '📢' };
            default:
                return { label: 'İçerik', bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700', icon: '📄' };
        }
    };

    if (contents.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <BookOpen size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Henüz içerik eklenmemiş</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => {
                const styles = getTypeStyles(content.type);
                return (
                    <div key={content.id} className={`${styles.bg} ${styles.border} border rounded-xl p-5 hover:shadow-md transition-shadow`}>
                        <div className="flex items-start justify-between mb-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                                <span>{styles.icon}</span>
                                {styles.label}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onEdit(content)}
                                    className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-yellow-600"
                                    title="Düzenle"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(content.id)}
                                    className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600"
                                    title="Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                                {content.grade === 'all' ? 'Tüm Sınıflar' : `${content.grade}. Sınıf`}
                            </span>
                            <span>{new Date(content.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{content.content}</p>

                        {content.image && (
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                <img src={content.image.url} alt={content.title} className="w-full h-32 object-cover" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ContentGrid;