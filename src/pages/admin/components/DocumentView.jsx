import React from 'react';
import { FileText, Calendar, User, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const DocumentView = ({ isOpen, onClose, document }) => {
    if (!document) return null;

    const fileIcons = {
        pdf: { icon: '📄', color: 'bg-red-100 text-red-700', label: 'PDF Dosyası' },
        doc: { icon: '📝', color: 'bg-blue-100 text-blue-700', label: 'Word Belgesi' },
        docx: { icon: '📝', color: 'bg-blue-100 text-blue-700', label: 'Word Belgesi' },
        ppt: { icon: '📊', color: 'bg-orange-100 text-orange-700', label: 'PowerPoint' },
        pptx: { icon: '📊', color: 'bg-orange-100 text-orange-700', label: 'PowerPoint' }
    };

    const fileInfo = fileIcons[document.fileType] || { icon: '📎', color: 'bg-gray-100 text-gray-700', label: 'Dosya' };
    const isPublished = document.status === 'published';
    const StatusIcon = isPublished ? CheckCircle : Clock;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Döküman Detayları" size="sm">
            <div className="space-y-6">
                <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                    <div className={`w-20 h-20 ${fileInfo.color} rounded-xl flex items-center justify-center text-4xl mb-3`}>
                        {fileInfo.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center break-all px-4">
                        {document.title}
                    </h3>
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <StatusIcon size={16} />
                        {isPublished ? 'Yayında' : 'Onay Bekliyor'}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText size={20} className="text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase font-medium">Dosya Bilgisi</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${fileInfo.color}`}>
                                    {fileInfo.label}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {document.fileSize ? `(${(document.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1 break-all">{document.fileName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <User size={20} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Yükleyen</p>
                                <p className="text-sm font-medium text-gray-900">{document.uploader}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar size={20} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Yükleme Tarihi</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(document.uploadDate).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Sınıf & Konu</p>
                            <p className="text-sm font-medium text-gray-900">
                                {document.grade}. Sınıf • {document.topic}
                            </p>
                        </div>
                    </div>

                    {isPublished && (
                        <button className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                            <Download size={20} />
                            Dosyayı İndir
                        </button>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <span>Döküman ID: #{document.id}</span>
                    <span>Oluşturulma: {new Date(document.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
            </div>
        </Modal>
    );
};

export default DocumentView;