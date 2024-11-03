import React from "react";
import { Product, ProductCategory } from "../../../types/product";

interface ProductFormFieldsProps {
  product: Product;
  setProduct: (product: Product) => void;
  categories: ProductCategory[];
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  product,
  setProduct,
  categories,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block mb-1">Nama Produk</label>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1">Kategori</label>
      <select
        value={product.productCategoryId}
        onChange={(e) =>
          setProduct({ ...product, productCategoryId: e.target.value })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      >
        <option value="">Pilih Kategori</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block mb-1">Area Name</label>
      <input
        type="text"
        value={product.areaName}
        onChange={(e) => setProduct({ ...product, areaName: e.target.value })}
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1">Composition</label>
      <input
        type="text"
        value={product.composition.join(",")}
        onChange={(e) =>
          setProduct({ ...product, composition: e.target.value.split(",") })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
        placeholder="Separate with commas"
      />
    </div>
    <div>
      <label className="block mb-1" htmlFor="description">
        Deskripsi
      </label>
      <textarea
        id="description"
        placeholder="Deskripsi"
        value={product.description}
        onChange={(e) =>
          setProduct({
            ...product,
            description: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="efficacy">
        Efficacy
      </label>
      <textarea
        id="efficacy"
        placeholder="Efficacy"
        value={product.efficacy}
        onChange={(e) =>
          setProduct({
            ...product,
            efficacy: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="familia">
        Familia
      </label>
      <input
        id="familia"
        type="text"
        placeholder="Familia"
        value={product.familia}
        onChange={(e) =>
          setProduct({
            ...product,
            familia: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="harvestAge">
        Usia Panen
      </label>
      <input
        id="harvestAge"
        type="number"
        placeholder="Usia Panen"
        value={product.harvestAge}
        onChange={(e) =>
          setProduct({
            ...product,
            harvestAge: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="latinName">
        Nama Latin
      </label>
      <input
        id="latinName"
        type="text"
        placeholder="Nama Latin"
        value={product.latinName}
        onChange={(e) =>
          setProduct({
            ...product,
            latinName: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="methodOfReproduction">
        Metode Reproduksi
      </label>
      <input
        id="methodOfReproduction"
        type="text"
        placeholder="Metode Reproduksi"
        value={product.methodOfReproduction}
        onChange={(e) =>
          setProduct({
            ...product,
            methodOfReproduction: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="morphology">
        Morfologi
      </label>
      <textarea
        id="morphology"
        placeholder="Morfologi"
        value={product.morphology}
        onChange={(e) =>
          setProduct({
            ...product,
            morphology: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="partUsed">
        Bagian yang Digunakan
      </label>
      <input
        id="partUsed"
        type="text"
        placeholder="Bagian yang Digunakan"
        value={product.partUsed}
        onChange={(e) =>
          setProduct({
            ...product,
            partUsed: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="price">
        Harga
      </label>
      <input
        id="price"
        type="number"
        placeholder="Harga"
        value={product.price}
        onChange={(e) =>
          setProduct({
            ...product,
            price: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="researchResults">
        Hasil Penelitian
      </label>
      <textarea
        id="researchResults"
        placeholder="Hasil Penelitian"
        value={product.researchResults}
        onChange={(e) =>
          setProduct({
            ...product,
            researchResults: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="synonym">
        Sinonim
      </label>
      <input
        id="synonym"
        type="text"
        placeholder="Sinonim"
        value={product.synonym}
        onChange={(e) =>
          setProduct({
            ...product,
            synonym: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="unitType">
        Tipe Satuan
      </label>
      <input
        id="unitType"
        type="text"
        placeholder="Tipe Satuan"
        value={product.unitType}
        onChange={(e) =>
          setProduct({
            ...product,
            unitType: e.target.value,
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>

    <div>
      <label className="block mb-1" htmlFor="utilization">
        Pemanfaatan (pisahkan dengan koma)
      </label>
      <textarea
        id="utilization"
        placeholder="Pemanfaatan (pisahkan dengan koma)"
        value={product.utilization.join(",")}
        onChange={(e) =>
          setProduct({
            ...product,
            utilization: e.target.value.split(","),
          })
        }
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>
  </div>
);
