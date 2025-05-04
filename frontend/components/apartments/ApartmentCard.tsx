import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

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
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ApartmentCard({ apartment, onEdit, onDelete }: ApartmentCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-2 shadow border border-gray-200 relative">
      <div className="absolute top-2 right-2 flex gap-1">
        {onEdit && (
          <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit Apartment">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete Apartment">
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
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