import React from 'react';
import { Mail, Phone, GraduationCap, Calendar, FileText, CheckCircle, XCircle, User, Clock } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const StudentView = ({ isOpen, onClose, student }) => {
    if (!student) return null;

    const isActive = student.status === 'active';
    const StatusIcon = isActive ? CheckCircle : XCircle;

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;

        let result = '';
        if (years > 0) result += `${years} yıl `;
        if (months > 0) result += `${months} ay `;
        if (days > 0) result += `${days} gün`;

        return result.trim() || '0 gün';
    };

    const duration = calculateDuration(student.membershipStart, student.membershipEnd);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Öğrenci Bilgileri" size="sm">
            <div className="space-y-6">
                <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                        {student.firstName.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-gray-500">Öğrenci</p>
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <StatusIcon size={16} />
                        {isActive ? 'Aktif' : 'Pasif'}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">E-posta</p>
                            <p className="text-sm font-medium text-gray-900">{student.email || 'Belirtilmemiş'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone size={20} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Telefon</p>
                                <p className="text-sm font-medium text-gray-900">{student.phone || 'Belirtilmemiş'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <User size={20} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Veli Telefonu</p>
                                <p className="text-sm font-medium text-gray-900">{student.parentPhone || 'Belirtilmemiş'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <GraduationCap size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Sınıf</p>
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium mt-1">
                                {student.grade}. Sınıf
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={20} className="text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-900">Üyelik Bilgileri</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Başlangıç:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(student.membershipStart).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bitiş:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(student.membershipEnd).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                <span className="text-blue-800 font-medium flex items-center gap-1">
                                    <Clock size={14} />
                                    Toplam Süre:
                                </span>
                                <span className="font-bold text-blue-900">{duration}</span>
                            </div>
                        </div>
                    </div>

                    {student.notes && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <FileText size={20} className="text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Notlar</p>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.notes}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Kayıt Tarihi</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(student.createdAt).toLocaleDateString('tr-TR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <span>Öğrenci ID: #{student.id}</span>
                    <span>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
                </div>
            </div>
        </Modal>
    );
};

export default StudentView;