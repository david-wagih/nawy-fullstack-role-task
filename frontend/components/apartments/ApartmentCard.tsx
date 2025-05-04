import { Card } from "@/components/ui/card";

export interface ApartmentCardProps {
  apartment: {
    id: string;
    unitName: string;
    unitNumber: string;
    project: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    description: string;
  };
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-2 shadow border border-gray-200">
      <div className="font-semibold text-lg mb-1">{apartment.unitName}</div>
      <div className="text-sm text-gray-700">Unit #{apartment.unitNumber}</div>
      <div className="text-sm text-gray-700">Project: {apartment.project}</div>
      <div className="text-sm text-gray-700">Address: {apartment.address}</div>
      <div className="text-sm text-gray-700">Bedrooms: {apartment.bedrooms}</div>
      <div className="text-sm text-gray-700">Bathrooms: {apartment.bathrooms}</div>
      <div className="text-sm text-gray-700">Price: ${apartment.price}</div>
      <div className="text-xs text-gray-500 mt-2">{apartment.description}</div>
    </Card>
  );
} 