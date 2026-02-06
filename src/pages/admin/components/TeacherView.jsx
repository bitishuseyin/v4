import React from 'react';
import { Mail, Phone, GraduationCap, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const TeacherView = ({ isOpen, onClose, teacher }) => {
    if (!teacher) return null;

    const isActive = teacher.status === 'active';
    const StatusIcon = isActive ? CheckCircle : XCircle;

    const hasOrtaokul = teacher.grades?.some(g => parseInt(g) <= 8);
    const hasLise = teacher.grades?.some(g => parseInt(g) >= 9);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Öğretmen Bilgileri" size="sm">
            <div className="space-y-6">
                <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                        {teacher.firstName.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-gray-500">Öğretmen</p>
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
                            <p className="text-sm font-medium text-gray-900">{teacher.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Telefon</p>
                            <p className="text-sm font-medium text-gray-900">
                                {teacher.phone || 'Belirtilmemiş'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <GraduationCap size={20} className="text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Verdiği Sınıflar</p>
                            <div className="flex flex-wrap gap-1">
                                {teacher.grades && teacher.grades.length > 0 ? (
                                    teacher.grades.sort().map((grade) => (
                                        <span
                                            key={grade}
                                            className={`px-2 py-1 rounded text-xs font-medium
                        ${parseInt(grade) <= 8 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                      `}
                                        >
                                            {grade}. Sınıf
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">Belirtilmemiş</span>
                                )}
                            </div>
                            {hasOrtaokul && hasLise && (
                                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Hem Ortaokul hem Lise
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Kayıt Tarihi</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(teacher.createdAt).toLocaleDateString('tr-TR', {
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
                    <span>Kullanıcı ID: #{teacher.id}</span>
                    <span>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
                </div>
            </div>
        </Modal>
    );
};

export default TeacherView;