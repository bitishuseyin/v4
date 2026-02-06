import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, BookOpen, ChevronRight, Save, AlertTriangle, Video, Calendar, FileText, ArrowRightLeft, XCircle, UserX, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import BulkActions from '../../components/common/BulkActions';
import ClassForm from './components/ClassForm';
import SubjectForm from './components/SubjectForm';
import Modal from '../../components/common/Modal';

const Curriculum = () => {
    const [classes, setClasses] = useState([
        { id: '5', name: '5. Sınıf', level: 'middle' },
        { id: '6', name: '6. Sınıf', level: 'middle' },
        { id: '9', name: '9. Sınıf', level: 'high' },
        { id: '10', name: '10. Sınıf', level: 'high' },
        { id: '11', name: '11. Sınıf', level: 'high' }
    ]);

    const [subjects, setSubjects] = useState({
        '5': [{ id: '1', name: 'Matematik' }, { id: '2', name: 'Fen Bilimleri' }],
        '9': [
            { id: '3', name: 'Fonksiyonlar' },
            { id: '4', name: 'Geometri' },
            { id: '5', name: 'Fizik' }
        ],
        '10': [
            { id: '6', name: 'Türev' },
            { id: '7', name: 'Kimya' }
        ]
    });

    const [contents, setContents] = useState({
        videos: [
            { id: 1, title: 'Fonksiyonlar 1', grade: '9', topic: 'Fonksiyonlar' },
            { id: 2, title: 'Geometri Temelleri', grade: '9', topic: 'Geometri' },
            { id: 3, title: 'Türev Giriş', grade: '10', topic: 'Türev' },
            { id: 4, title: '5. Sınıf Matematik', grade: '5', topic: 'Matematik' }
        ],
        liveLessons: [
            { id: 1, topic: 'Fonksiyonlar Canlı', grade: '9', topicName: 'Fonksiyonlar' },
            { id: 2, topic: 'Fizik Lab', grade: '10', topicName: 'Kimya' }
        ],
        documents: [
            { id: 1, title: '9. Sınıf Konu Anlatımı', grade: '9', topic: 'Fonksiyonlar' },
            { id: 2, title: 'Formül Listesi', grade: '10', topic: 'Türev' }
        ]
    });

    const [selectedClass, setSelectedClass] = useState(null);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [editingSubject, setEditingSubject] = useState(null);

    // Seçimler için state
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // Sıralama için state
    const [classSort, setClassSort] = useState({ key: 'name', direction: 'asc' });
    const [subjectSort, setSubjectSort] = useState({ key: 'name', direction: 'asc' });

    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteMode, setDeleteMode] = useState('keep');

    // İçerik sayılarını hesapla
    const getContentCountsByClass = (classId) => {
        return {
            videos: contents.videos.filter(v => v.grade === classId).length,
            liveLessons: contents.liveLessons.filter(l => l.grade === classId).length,
            documents: contents.documents.filter(d => d.grade === classId).length
        };
    };

    const getContentCountsBySubject = (classId, subjectName) => {
        return {
            videos: contents.videos.filter(v => v.grade === classId && v.topic === subjectName).length,
            liveLessons: contents.liveLessons.filter(l => l.grade === classId && l.topicName === subjectName).length,
            documents: contents.documents.filter(d => d.grade === classId && d.topic === subjectName).length
        };
    };

    const hasContent = (counts) => {
        return counts.videos > 0 || counts.liveLessons > 0 || counts.documents > 0;
    };

    // Sıralı sınıflar
    const sortedClasses = useMemo(() => {
        return [...classes].sort((a, b) => {
            if (classSort.key === 'name') {
                return classSort.direction === 'asc'
                    ? a.name.localeCompare(b.name, 'tr')
                    : b.name.localeCompare(a.name, 'tr');
            }
            if (classSort.key === 'level') {
                return classSort.direction === 'asc'
                    ? (a.level === 'middle' ? -1 : 1)
                    : (a.level === 'middle' ? 1 : -1);
            }
            return 0;
        });
    }, [classes, classSort]);

    // Sıralı konular
    const sortedSubjects = useMemo(() => {
        if (!selectedClass) return [];
        const subs = subjects[selectedClass.id] || [];
        return [...subs].sort((a, b) => {
            return subjectSort.direction === 'asc'
                ? a.name.localeCompare(b.name, 'tr')
                : b.name.localeCompare(a.name, 'tr');
        });
    }, [subjects, selectedClass, subjectSort]);

    // Toplu sınıf silme
    const handleBulkDeleteClasses = () => {
        const totalContent = selectedClasses.reduce((acc, classId) => {
            const counts = getContentCountsByClass(classId);
            return acc + counts.videos + counts.liveLessons + counts.documents;
        }, 0);

        let message = `${selectedClasses.length} sınıfı silmek istediğinize emin misiniz?`;
        if (totalContent > 0) {
            message += `\n\n${totalContent} adet içerik etkilenecektir. İçerikler "Bilinmeyen Sınıf" olarak kalacaktır.`;
        }

        if (window.confirm(message)) {
            selectedClasses.forEach(classId => {
                const newSubjects = { ...subjects };
                delete newSubjects[classId];
                setSubjects(newSubjects);
            });
            setClasses(classes.filter(c => !selectedClasses.includes(c.id)));
            setSelectedClasses([]);
            toast.success(`${selectedClasses.length} sınıf silindi`);
        }
    };

    // Toplu konu silme
    const handleBulkDeleteSubjects = () => {
        if (!selectedClass) return;

        const totalContent = selectedSubjects.reduce((acc, subjectId) => {
            const subject = subjects[selectedClass.id].find(s => s.id === subjectId);
            if (subject) {
                const counts = getContentCountsBySubject(selectedClass.id, subject.name);
                return acc + counts.videos + counts.liveLessons + counts.documents;
            }
            return acc;
        }, 0);

        let message = `${selectedSubjects.length} konuyu silmek istediğinize emin misiniz?`;
        if (totalContent > 0) {
            message += `\n\n${totalContent} adet içerik etkilenecektir.`;
        }

        if (window.confirm(message)) {
            const updated = subjects[selectedClass.id].filter(s => !selectedSubjects.includes(s.id));
            setSubjects({ ...subjects, [selectedClass.id]: updated });
            setSelectedSubjects([]);
            toast.success(`${selectedSubjects.length} konu silindi`);
        }
    };

    const handleDeleteClass = (classId) => {
        const counts = getContentCountsByClass(classId);
        const classData = classes.find(c => c.id === classId);

        if (hasContent(counts)) {
            setDeleteConfirm({ type: 'class', data: classData, counts });
            setDeleteMode('keep');
        } else {
            if (window.confirm(`"${classData.name}" silinecek. Emin misiniz?`)) {
                executeDeleteClass(classId, false);
            }
        }
    };

    const executeDeleteClass = (classId, deleteContents) => {
        if (deleteContents) {
            setContents(prev => ({
                videos: prev.videos.filter(v => v.grade !== classId),
                liveLessons: prev.liveLessons.filter(l => l.grade !== classId),
                documents: prev.documents.filter(d => d.grade !== classId)
            }));
        }
        setClasses(classes.filter(c => c.id !== classId));
        const newSubjects = { ...subjects };
        delete newSubjects[classId];
        setSubjects(newSubjects);
        if (selectedClass?.id === classId) setSelectedClass(null);
        setSelectedClasses(prev => prev.filter(id => id !== classId));
        setDeleteConfirm(null);
        toast.success(deleteContents ? 'Sınıf ve içerikleri silindi' : 'Sınıf silindi');
    };

    const handleDeleteSubject = (subjectId, subjectName) => {
        const counts = getContentCountsBySubject(selectedClass.id, subjectName);

        if (hasContent(counts)) {
            setDeleteConfirm({ type: 'subject', data: { id: subjectId, name: subjectName, classId: selectedClass.id }, counts });
            setDeleteMode('keep');
        } else {
            if (window.confirm(`"${subjectName}" silinecek. Emin misiniz?`)) {
                executeDeleteSubject(subjectId, false);
            }
        }
    };

    const executeDeleteSubject = (subjectId, deleteContents, subjectName) => {
        if (deleteContents && subjectName) {
            setContents(prev => ({
                videos: prev.videos.filter(v => !(v.grade === selectedClass.id && v.topic === subjectName)),
                liveLessons: prev.liveLessons.filter(l => !(l.grade === selectedClass.id && l.topicName === subjectName)),
                documents: prev.documents.filter(d => !(d.grade === selectedClass.id && d.topic === subjectName))
            }));
        }
        const updated = subjects[selectedClass.id].filter(s => s.id !== subjectId);
        setSubjects({ ...subjects, [selectedClass.id]: updated });
        setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
        setDeleteConfirm(null);
        toast.success('Konu silindi');
    };

    const handleTransferClass = (targetClassId) => {
        const sourceClassId = deleteConfirm.data.id;

        const sourceSubjects = subjects[sourceClassId] || [];
        const targetSubjects = subjects[targetClassId] || [];

        const newSubjectsForTarget = [...targetSubjects];
        sourceSubjects.forEach(sub => {
            if (!targetSubjects.find(t => t.name === sub.name)) {
                newSubjectsForTarget.push({ ...sub, id: Date.now().toString() + Math.random() });
            }
        });

        setSubjects({ ...subjects, [targetClassId]: newSubjectsForTarget });

        setContents(prev => ({
            videos: prev.videos.map(v => v.grade === sourceClassId ? { ...v, grade: targetClassId } : v),
            liveLessons: prev.liveLessons.map(l => l.grade === sourceClassId ? { ...l, grade: targetClassId } : l),
            documents: prev.documents.map(d => d.grade === sourceClassId ? { ...d, grade: targetClassId } : d)
        }));

        setClasses(classes.filter(c => c.id !== sourceClassId));
        const newSubjectsState = { ...subjects };
        delete newSubjectsState[sourceClassId];
        setSubjects(newSubjectsState);

        if (selectedClass?.id === sourceClassId) setSelectedClass(null);
        setSelectedClasses(prev => prev.filter(id => id !== sourceClassId));

        toast.success(`İçerikler ${classes.find(c => c.id === targetClassId).name}'e devredildi`);
        setDeleteConfirm(null);
    };

    const handleSaveClass = (classData) => {
        if (editingClass) {
            setClasses(classes.map(c => c.id === editingClass.id ? classData : c));
            toast.success('Sınıf güncellendi');
        } else {
            setClasses([...classes, classData]);
            setSubjects({ ...subjects, [classData.id]: [] });
            toast.success('Yeni sınıf eklendi');
        }
        setEditingClass(null);
    };

    const handleSaveSubject = (subjectData) => {
        const currentSubjects = subjects[selectedClass.id] || [];
        if (editingSubject) {
            const updated = currentSubjects.map(s => s.id === editingSubject.id ? subjectData : s);
            setSubjects({ ...subjects, [selectedClass.id]: updated });
            toast.success('Konu güncellendi');
        } else {
            setSubjects({ ...subjects, [selectedClass.id]: [...currentSubjects, subjectData] });
            toast.success('Yeni konu eklendi');
        }
        setEditingSubject(null);
    };

    const handleExport = () => {
        const data = { classes, subjects };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'curriculum-data.json';
        a.click();
        toast.success('Veriler indirildi!');
    };

    const getSortIcon = (currentKey, sortConfig) => {
        if (sortConfig.key !== currentKey) return <ChevronUp size={16} className="text-gray-300" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={16} className="text-blue-600" />
            : <ChevronDown size={16} className="text-blue-600" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sınıf ve Konu Yönetimi</h1>
                    <p className="text-gray-500 mt-1">Müfredat yapısını düzenleyin</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleExport}>
                        <Download size={18} className="mr-2" /> JSON İndir
                    </Button>
                    <Button onClick={() => { setEditingClass(null); setIsClassModalOpen(true); }}>
                        <Plus size={18} className="mr-2" /> Yeni Sınıf
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sınıflar Listesi */}
                <div className="card lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-600" />
                            Sınıflar
                        </h2>
                        <div className="flex gap-2 text-xs">
                            <button
                                onClick={() => setClassSort(prev => ({ key: 'name', direction: prev.key === 'name' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                İsim {getSortIcon('name', classSort)}
                            </button>
                            <button
                                onClick={() => setClassSort(prev => ({ key: 'level', direction: prev.key === 'level' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Kademe {getSortIcon('level', classSort)}
                            </button>
                        </div>
                    </div>

                    {/* Sınıflar için Bulk Actions */}
                    <BulkActions
                        selectedCount={selectedClasses.length}
                        onDelete={handleBulkDeleteClasses}
                        onExport={() => {
                            const selectedData = classes.filter(c => selectedClasses.includes(c.id));
                            console.log('Export:', selectedData);
                            toast.success(`${selectedData.length} sınıf dışa aktarıldı`);
                            setSelectedClasses([]);
                        }}
                        showApprove={false}
                        showExport={true}
                    />

                    <div className="space-y-2">
                        {sortedClasses.map((cls) => {
                            const counts = getContentCountsByClass(cls.id);
                            const totalContent = counts.videos + counts.liveLessons + counts.documents;
                            const isSelected = selectedClass?.id === cls.id;
                            const isChecked = selectedClasses.includes(cls.id);

                            return (
                                <div key={cls.id}
                                    className={`p-3 rounded-lg border-2 transition-all
                    ${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedClasses([...selectedClasses, cls.id]);
                                                else setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                                            }}
                                            className="rounded border-gray-300"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedClass(cls)}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{cls.level === 'middle' ? '🏫' : '🎓'}</span>
                                                <span className="font-medium text-gray-900">{cls.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => { setEditingClass(cls); setIsClassModalOpen(true); }}
                                                className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-blue-600">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteClass(cls.id)}
                                                className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500 ml-7">
                                        <span>{(subjects[cls.id] || []).length} konu</span>
                                        {totalContent > 0 && (
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                <Video size={10} /> {totalContent}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Konular Listesi */}
                <div className="card lg:col-span-2">
                    {selectedClass ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <span className="text-2xl">📚</span>
                                        {selectedClass.name} Konuları
                                        <button
                                            onClick={() => setSubjectSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                            className="ml-2 p-1 bg-gray-100 rounded hover:bg-gray-200"
                                            title="Sırala"
                                        >
                                            {getSortIcon('name', subjectSort)}
                                        </button>
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(subjects[selectedClass.id] || []).length} konu tanımlı
                                    </p>
                                </div>
                                <Button size="sm" onClick={() => { setEditingSubject(null); setIsSubjectModalOpen(true); }}>
                                    <Plus size={16} className="mr-1" /> Konu Ekle
                                </Button>
                            </div>

                            {/* Konular için Bulk Actions */}
                            <BulkActions
                                selectedCount={selectedSubjects.length}
                                onDelete={handleBulkDeleteSubjects}
                                showApprove={false}
                                showExport={false}
                            />

                            <div className="space-y-2">
                                {sortedSubjects.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p>Bu sınıfa ait konu bulunmuyor.</p>
                                    </div>
                                ) : (
                                    sortedSubjects.map((subject, index) => {
                                        const counts = getContentCountsBySubject(selectedClass.id, subject.name);
                                        const total = counts.videos + counts.liveLessons + counts.documents;
                                        const isChecked = selectedSubjects.includes(subject.id);

                                        return (
                                            <div key={subject.id}
                                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedSubjects([...selectedSubjects, subject.id]);
                                                            else setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id));
                                                        }}
                                                        className="rounded border-gray-300"
                                                    />
                                                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-800">{subject.name}</span>
                                                        {total > 0 && (
                                                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                                {counts.videos > 0 && <span className="flex items-center gap-1"><Video size={12} /> {counts.videos}</span>}
                                                                {counts.liveLessons > 0 && <span className="flex items-center gap-1"><Calendar size={12} /> {counts.liveLessons}</span>}
                                                                {counts.documents > 0 && <span className="flex items-center gap-1"><FileText size={12} /> {counts.documents}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setEditingSubject(subject); setIsSubjectModalOpen(true); }}
                                                        className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDeleteSubject(subject.id, subject.name)}
                                                        className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                            <ChevronRight size={48} className="mb-4 opacity-50" />
                            <p>Konuları görmek için sol taraftan bir sınıf seçin</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Silme Onay Modalı */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title={
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={24} />
                        <span>{deleteConfirm?.type === 'class' ? 'Sınıf' : 'Konu'} Silme - İçerik Uyarısı</span>
                    </div>
                }
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-gray-800 font-medium mb-2">
                            "{deleteConfirm?.data.name || deleteConfirm?.data.className}" silmek üzeresiniz.
                        </p>
                        <div className="space-y-2">
                            {deleteConfirm?.counts.videos > 0 && (
                                <div className="flex items-center gap-2 text-red-700 bg-white p-2 rounded border border-red-100">
                                    <Video size={18} />
                                    <span className="font-bold">{deleteConfirm.counts.videos}</span>
                                    <span>Video</span>
                                </div>
                            )}
                            {deleteConfirm?.counts.liveLessons > 0 && (
                                <div className="flex items-center gap-2 text-red-700 bg-white p-2 rounded border border-red-100">
                                    <Calendar size={18} />
                                    <span className="font-bold">{deleteConfirm.counts.liveLessons}</span>
                                    <span>Canlı Ders</span>
                                </div>
                            )}
                            {deleteConfirm?.counts.documents > 0 && (
                                <div className="flex items-center gap-2 text-red-700 bg-white p-2 rounded border border-red-100">
                                    <FileText size={18} />
                                    <span className="font-bold">{deleteConfirm.counts.documents}</span>
                                    <span>Döküman</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Bu içerikler ne yapılsın?</p>

                        {deleteConfirm?.type === 'class' && (
                            <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                ${deleteMode === 'transfer' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                                <input type="radio" name="deleteMode" value="transfer" checked={deleteMode === 'transfer'}
                                    onChange={(e) => setDeleteMode(e.target.value)} className="mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-medium text-gray-800">
                                        <ArrowRightLeft size={18} className="text-purple-600" />
                                        Başka Sınıfa Birleştir
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Konular ve içerikler başka sınıfa aktarılır.</p>
                                </div>
                            </label>
                        )}

                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
              ${deleteMode === 'keep' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="deleteMode" value="keep" checked={deleteMode === 'keep'}
                                onChange={(e) => setDeleteMode(e.target.value)} className="mt-1" />
                            <div>
                                <div className="font-medium">İçerikleri Koru</div>
                                <p className="text-sm text-gray-500">Bilinmeyen olarak kal</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
              ${deleteMode === 'delete' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                            <input type="radio" name="deleteMode" value="delete" checked={deleteMode === 'delete'}
                                onChange={(e) => setDeleteMode(e.target.value)} className="mt-1" />
                            <div>
                                <div className="font-medium text-red-700">İçerikleri de Sil</div>
                                <p className="text-sm text-gray-500">Kalıcı olarak silinsin</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>İptal</Button>
                        {deleteMode === 'transfer' && deleteConfirm?.type === 'class' ? (
                            <Button onClick={() => {
                                const available = classes.filter(c => c.id !== deleteConfirm.data.id);
                                if (available.length > 0) handleTransferClass(available[0].id);
                            }} className="bg-purple-600">Birleştir</Button>
                        ) : (
                            <Button variant={deleteMode === 'delete' ? 'danger' : 'primary'}
                                onClick={() => deleteConfirm?.type === 'class'
                                    ? executeDeleteClass(deleteConfirm.data.id, deleteMode === 'delete')
                                    : executeDeleteSubject(deleteConfirm.data.id, deleteMode === 'delete', deleteConfirm.data.name)
                                }>
                                {deleteMode === 'delete' ? 'Hepsini Sil' : 'Sil'}
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>

            <ClassForm isOpen={isClassModalOpen} onClose={() => { setIsClassModalOpen(false); setEditingClass(null); }} onSave={handleSaveClass} initialData={editingClass} />
            <SubjectForm isOpen={isSubjectModalOpen} onClose={() => { setIsSubjectModalOpen(false); setEditingSubject(null); }} onSave={handleSaveSubject} initialData={editingSubject} className={selectedClass?.name} />
        </div>
    );
};

export default Curriculum;