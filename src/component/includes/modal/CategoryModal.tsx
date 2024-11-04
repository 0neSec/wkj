import React from 'react';
import { ProductCategory } from '../../../pages/Dashboard/admin/product/productCategory/types';

interface CategoryModalProps {
  isEdit: boolean;
  category: ProductCategory | null;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (name: string) => void;
  categoryName: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isEdit,
  onClose,
  onSave,
  onNameChange,
  categoryName,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative z-50">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
        </h2>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama Kategori"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg transition duration-200"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            {isEdit ? "Update" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};