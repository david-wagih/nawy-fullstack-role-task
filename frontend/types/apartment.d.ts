export interface Apartment {
    id: string;
    unitName: string;
    unitNumber: string;
    project: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    images: string[];
  }

  export interface ApartmentFormValues {
    unitName: string;
    unitNumber: string;
    project: string;
    address: string;
    bedrooms: string;
    bathrooms: string;
    price: string;
    description: string;
  }