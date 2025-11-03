import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Sim",
  cancelText = "Não",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg text-white w-96 max-w-lg mx-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="mb-6 text-gray-300 whitespace-pre-line">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
