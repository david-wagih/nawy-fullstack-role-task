import ApartmentCard from "./ApartmentCard";

export interface ApartmentsGridProps {
  apartments: Array<{
    id: string;
    unitName: string;
    unitNumber: string;
    project: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    description: string;
  }>;
}

export default function ApartmentsGrid({ apartments }: ApartmentsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartments.map((apt) => (
        <ApartmentCard key={apt.id} apartment={apt} />
      ))}
    </div>
  );
} 