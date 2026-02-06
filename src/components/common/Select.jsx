import React from 'react';

const Select = ({ label, options, error, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all bg-white
          ${error
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                {...props}
            >
                <option value="">Seçiniz...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Select;