import React from 'react';
import { Product } from '../../../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b hidden md:table-cell">Category</th>
            <th className="py-2 px-4 border-b hidden md:table-cell">Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b hidden md:table-cell">
                {product.productCategoryId}
              </td>
              <td className="py-2 px-4 border-b hidden md:table-cell">
                ${product.price}
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex flex-col md:flex-row gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="w-full md:w-auto bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id!)}
                    className="w-full md:w-auto bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);