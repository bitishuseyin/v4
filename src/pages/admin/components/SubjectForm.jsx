import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const SubjectForm = ({ isOpen, onClose, onSave, initialData, className }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        onSave({
            id: initialData?.id || Date.now().toString(),
            name
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Konu Düzenle' : 'Yeni Konu Ekle'} size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Sınıf: <span className="font-semibold text-gray-800">{className}</span></p>
                </div>

                <Input
                    label="Konu Adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Fonksiyonlar"
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{initialData ? 'Güncelle' : 'Ekle'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default SubjectForm;