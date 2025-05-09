export class CreateApartmentDto {
  unitName: string;
  unitNumber: string;
  project: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  description: string;
  images?: string[];
}
