import React from 'react';
import { Trash2, CheckCircle, XCircle, Download } from 'lucide-react';
import Button from './Button';

const BulkActions = ({
    selectedCount,
    onDelete,
    onApprove,
    onReject,
    onExport,
    showApprove = true,
    showReject = false,
    showExport = true
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold min-w-[24px] text-center">
                    {selectedCount}
                </span>
                <span className="text-sm font-medium text-gray-700">
                    öğe seçildi
                </span>
            </div>

            <div className="flex items-center gap-2">
                {showApprove && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onApprove}
                        className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                    >
                        <CheckCircle size={16} />
                        Onayla
                    </Button>
                )}

                {showReject && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onReject}
                        className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                    >
                        <XCircle size={16} />
                        Reddet
                    </Button>
                )}

                {showExport && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onExport}
                        className="flex items-center gap-1"
                    >
                        <Download size={16} />
                        Dışa Aktar
                    </Button>
                )}

                <Button
                    size="sm"
                    variant="danger"
                    onClick={onDelete}
                    className="flex items-center gap-1"
                >
                    <Trash2 size={16} />
                    Sil
                </Button>
            </div>
        </div>
    );
};

export default BulkActions;