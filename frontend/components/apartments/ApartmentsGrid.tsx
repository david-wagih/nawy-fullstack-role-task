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
    images?: string[];
  }>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ApartmentsGrid({ apartments, onEdit, onDelete }: ApartmentsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartments.map((apt) => (
        <ApartmentCard
          key={apt.id}
          apartment={{ ...apt }}
          onEdit={onEdit ? () => onEdit(apt.id) : undefined}
          onDelete={onDelete ? () => onDelete(apt.id) : undefined}
        />
      ))}
    </div>
  );
} 