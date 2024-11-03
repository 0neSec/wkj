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
  
  export interface ProductCategory {
    id: string;
    name: string;
  }