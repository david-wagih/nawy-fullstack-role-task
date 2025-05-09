export class Apartment {
  id: string;
  unitName: string;
  unitNumber: string;
  project: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}

export class ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
