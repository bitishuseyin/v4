import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({
    columns,
    data,
    onRowClick,
    emptyMessage = 'Veri bulunamadı',
    itemsPerPage = 10,
    enableSorting = true,
    enablePagination = true
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);

    // Sıralama fonksiyonu
    const sortedData = React.useMemo(() => {
        if (!enableSorting || !sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue, 'tr')
                    : bValue.localeCompare(aValue, 'tr');
            }

            if (typeof aValue === 'number' || !isNaN(Date.parse(aValue))) {
                return sortConfig.direction === 'asc'
                    ? (aValue > bValue ? 1 : -1)
                    : (aValue < bValue ? 1 : -1);
            }

            return 0;
        });
    }, [data, sortConfig, enableSorting]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = enablePagination
        ? sortedData.slice(startIndex, startIndex + itemsPerPage)
        : sortedData;

    const handleSort = (key) => {
        if (!enableSorting) return;

        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <ChevronUp size={16} className="text-gray-300" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={16} className="text-blue-600" />
            : <ChevronDown size={16} className="text-blue-600" />;
    };

    return (
        <div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${col.sortable !== false && enableSorting ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.title}
                                        {enableSorting && col.sortable !== false && getSortIcon(col.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => onRowClick?.(row)}
                                    className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3 text-sm text-gray-900">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {enablePagination && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-sm text-gray-600">
                        {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} / {sortedData.length} kayıt
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Önceki
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded text-sm font-medium transition-colors
                    ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;