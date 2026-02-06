import React from 'react';
import { Calendar, Clock, Link2, User, CheckCircle, XCircle, Clock as ClockIcon, Video } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const LessonView = ({ isOpen, onClose, lesson }) => {
    if (!lesson) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'active':
                return { label: 'Aktif', color: 'text-green-600 bg-green-50', icon: CheckCircle };
            case 'pending':
                return { label: 'Onay Bekliyor', color: 'text-yellow-600 bg-yellow-50', icon: ClockIcon };
            default:
                return { label: 'Pasif', color: 'text-gray-600 bg-gray-50', icon: XCircle };
        }
    };

    const getPlatformInfo = (platform) => {
        switch (platform) {
            case 'zoom': return { name: 'Zoom', color: 'bg-blue-100 text-blue-800' };
            case 'meet': return { name: 'Google Meet', color: 'bg-green-100 text-green-800' };
            case 'teams': return { name: 'Microsoft Teams', color: 'bg-purple-100 text-purple-800' };
            default: return { name: platform, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const statusInfo = getStatusInfo(lesson.status);
    const platformInfo = getPlatformInfo(lesson.platform);
    const StatusIcon = statusInfo.icon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Canlı Ders Detayları" size="sm">
            <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Video size={32} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{lesson.topic}</h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${statusInfo.color}`}>
                            <StatusIcon size={14} />
                            {statusInfo.label}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Sınıf</label>
                        <div className="text-sm font-medium text-gray-900">{lesson.grade}. Sınıf</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Konu</label>
                        <div className="text-sm font-medium text-gray-900">{lesson.subject}</div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Tarih</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(lesson.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Saat / Süre</p>
                            <p className="text-sm font-medium text-gray-900">{lesson.time} ({lesson.duration} dakika)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <User size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Öğretmen</p>
                            <p className="text-sm font-medium text-gray-900">{lesson.teacher}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase">Platform</label>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${platformInfo.color}`}>
                        <span>{platformInfo.name}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase">Toplantı Linki</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Link2 size={18} className="text-gray-400" />
                        <a
                            href={lesson.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate flex-1"
                        >
                            {lesson.link}
                        </a>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Oluşturulma: {new Date(lesson.createdAt).toLocaleDateString('tr-TR')}</span>
                        <span>ID: #{lesson.id}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LessonView;