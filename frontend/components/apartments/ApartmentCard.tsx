import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    images?: string[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ApartmentCard({ apartment, onEdit, onDelete }: ApartmentCardProps) {
  const firstImage = apartment.images && apartment.images.length > 0 ?
    (apartment.images[0].startsWith('http') ? apartment.images[0] : `${process.env.NEXT_PUBLIC_API_URL}${apartment.images[0]}`)
    : null;
  return (
    <Card className="p-4 flex flex-col gap-2 shadow border border-gray-200 group cursor-pointer">
      <div className="flex justify-end gap-1 mb-2">
        {onEdit && (
          <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); onEdit(); }} aria-label="Edit Apartment" className="cursor-pointer">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); onDelete(); }} aria-label="Delete Apartment" className="cursor-pointer">
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
      <Link href={`/apartments/${apartment.id}`} className="flex flex-col gap-2 flex-1" tabIndex={-1}>
        {firstImage && (
          <div className="relative w-full h-32 flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
            <Image
              src={firstImage}
              alt={apartment.unitName}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
              unoptimized
            />
          </div>
        )}
        <div className="font-semibold text-lg mb-1 group-hover:underline">{apartment.unitName}</div>
        <div className="text-sm text-gray-700">Unit #{apartment.unitNumber}</div>
        <div className="text-sm text-gray-700">Project: {apartment.project}</div>
        <div className="text-sm text-gray-700">Address: {apartment.address}</div>
        <div className="text-sm text-gray-700">Bedrooms: {apartment.bedrooms}</div>
        <div className="text-sm text-gray-700">Bathrooms: {apartment.bathrooms}</div>
        <div className="text-sm text-gray-700">Price: ${apartment.price}</div>
        <div className="text-xs text-gray-500 mt-2">{apartment.description}</div>
      </Link>
    </Card>
  );
} 