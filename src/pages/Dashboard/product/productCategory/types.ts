// types.ts
export interface ProductCategory {
    id: string;
    name: string;
  }
  
  export interface CreateCategoryData {
    name: string;
  }
  
  export interface UpdateCategoryData {
    id: string;
    name: string;
  }
  
  // constants.ts
  export const userFriendlyMessages = {
    CREATE_SUCCESS: "Kategori berhasil dibuat.",
    UPDATE_SUCCESS: "Kategori berhasil diupdate.",
    DELETE_SUCCESS: "Kategori berhasil dihapus.",
    CREATE_FAILED: "Gagal membuat kategori. Silakan coba lagi.",
    UPDATE_FAILED: "Gagal mengupdate kategori. Silakan coba lagi.",
    DELETE_FAILED: "Gagal menghapus kategori. Silakan coba lagi.",
    LOAD_FAILED: "Gagal memuat kategori. Silakan refresh halaman.",
    NETWORK_ERROR: "Periksa koneksi internet Anda dan coba lagi.",
    EMPTY_NAME: "Nama kategori tidak boleh kosong.",
    DUPLICATE_NAME: "Kategori dengan nama ini sudah ada.",
    INVALID_INPUT: "Input yang Anda masukkan tidak valid.",
    SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
  };