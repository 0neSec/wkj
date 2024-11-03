export const userFriendlyMessages = {
    LOAD_FAILED: "Failed to load products. Please try again later.",
    CREATE_FAILED: "Failed to create product. Please check your input and try again.",
    UPDATE_FAILED: "Failed to update product. Please check your input and try again.",
    DELETE_FAILED: "Failed to delete product. Please try again later.",
    CREATE_SUCCESS: "Product created successfully!",
    UPDATE_SUCCESS: "Product updated successfully!",
    DELETE_SUCCESS: "Product deleted successfully!",
    EMPTY_NAME: "Product name cannot be empty.",
    EMPTY_CATEGORY: "Please select a product category.",
    IMAGE_UPLOAD_FAILED: "Failed to upload image. Please try again.",
    INVALID_PRICE: "Please enter a valid price.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    VALIDATION_ERROR: "Please check your input and try again.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
  };

 export interface Product {
    id?: string;
    name: string;
    productCategoryId: string;
    areaName: string;
    composition: string[];
    description: string;
    efficacy: string;
    familia: string;
    harvestAge: string;
    latinName: string;
    methodOfReproduction: string;
    morphology: string;
    partUsed: string;
    price: string;
    researchResults: string;
    synonym: string;
    unitType: string;
    utilization: string[];
    image_url?: File;
  }