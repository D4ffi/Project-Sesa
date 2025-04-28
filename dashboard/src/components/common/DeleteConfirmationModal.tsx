import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemCount: number;
    itemType: 'producto' | 'categoría';
    confirmationText: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
                                                                             isOpen,
                                                                             onClose,
                                                                             onConfirm,
                                                                             itemCount,
                                                                             itemType,
                                                                             confirmationText
                                                                         }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (inputValue === confirmationText) {
            onConfirm();
            setInputValue(''); // Reset input field
            setError(null);
        } else {
            setError(`Por favor escriba "${confirmationText}" para confirmar la eliminación.`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                        <AlertTriangle size={20} className="text-red-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-800">Confirmar Eliminación</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        Está a punto de eliminar {itemCount} {itemCount === 1 ? itemType : itemType + 's'}.
                        Esta acción no se puede deshacer.
                    </p>

                    <p className="text-gray-700 mb-4">
                        Para confirmar, escriba <span className="font-semibold">{confirmationText}</span> en el campo de abajo:
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder={`Escriba "${confirmationText}" para confirmar`}
                        />

                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Eliminar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;