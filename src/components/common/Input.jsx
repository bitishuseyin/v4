import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-all
            ${Icon ? 'pl-10' : ''}
            ${error
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;