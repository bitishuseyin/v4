import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ClassForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [level, setLevel] = useState('high'); // middle veya high

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setLevel(initialData.level);
        } else {
            setName('');
            setLevel('high');
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        onSave({
            id: initialData?.id || Date.now().toString(),
            name,
            level
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Sınıf Düzenle' : 'Yeni Sınıf Ekle'} size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Sınıf Adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: 9. Sınıf"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kademe</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="level"
                                value="middle"
                                checked={level === 'middle'}
                                onChange={(e) => setLevel(e.target.value)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Ortaokul</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="level"
                                value="high"
                                checked={level === 'high'}
                                onChange={(e) => setLevel(e.target.value)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Lise</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{initialData ? 'Güncelle' : 'Ekle'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ClassForm;