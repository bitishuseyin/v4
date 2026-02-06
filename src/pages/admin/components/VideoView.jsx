import React from 'react';
import { Video, FileText, Calendar, User, CheckCircle, Clock, XCircle, BookOpen } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const VideoView = ({ isOpen, onClose, video }) => {
    if (!video) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'published':
                return { label: 'Yayında', color: 'text-green-600 bg-green-50', icon: CheckCircle };
            case 'pending':
                return { label: 'Onay Bekliyor', color: 'text-yellow-600 bg-yellow-50', icon: Clock };
            default:
                return { label: 'Taslak', color: 'text-gray-600 bg-gray-50', icon: XCircle };
        }
    };

    const statusInfo = getStatusInfo(video.status);
    const StatusIcon = statusInfo.icon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Video Detayları" size="sm">
            <div className="space-y-6">
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Video size={32} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{video.title}</h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${statusInfo.color}`}>
                            <StatusIcon size={14} />
                            {statusInfo.label}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Sınıf</label>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <BookOpen size={16} className="text-gray-400" />
                            {video.grade}. Sınıf
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Konu</label>
                        <div className="text-sm font-medium text-gray-900">{video.topic}</div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Yükleyen</label>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <User size={16} className="text-gray-400" />
                            {video.uploader}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Yükleme Tarihi</label>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Calendar size={16} className="text-gray-400" />
                            {new Date(video.uploadDate).toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                </div>

                {/* Dates */}
                {video.publishDate && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                            <CheckCircle size={16} />
                            <span className="font-medium">Yayın Tarihi:</span>
                            {new Date(video.publishDate).toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                )}

                {/* Description */}
                {video.description && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase">Açıklama</label>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {video.description}
                        </p>
                    </div>
                )}

                {/* Files Info */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase">Dosyalar</label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <Video size={20} className="text-blue-600" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Video Dosyası</p>
                                <p className="text-xs text-gray-500">{video.videoFile?.name || 'Yüklenmiş'}</p>
                            </div>
                        </div>

                        {video.pdfFile && (
                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <FileText size={20} className="text-red-600" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">PDF Döküman</p>
                                    <p className="text-xs text-gray-500">{video.pdfFile?.name || 'Mevcut'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                    {video.sequentialAccess && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Sıralı Erişim Aktif
                        </div>
                    )}
                    {video.isPublished && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Yayında
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default VideoView;