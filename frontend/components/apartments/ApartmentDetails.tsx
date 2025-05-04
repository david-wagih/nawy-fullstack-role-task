"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import ApartmentFormDialog from "./ApartmentFormDialog";
import { useAppDispatch } from "@/store/store";
import { updateApartment, deleteApartment } from "@/store/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ApartmentDetailsClient({ apartment }: { apartment: any }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleEdit = async (values: any) => {
    setEditLoading(true);
    setEditError(null);
    try {
      await dispatch(updateApartment({
        id: apartment.id,
        updates: {
          ...values,
          bedrooms: Number(values.bedrooms),
          bathrooms: Number(values.bathrooms),
          price: Number(values.price),
        },
      }) as any);
      toast.success("Apartment updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      setEditError(err.message || "Failed to update apartment");
      toast.error(err.message || "Failed to update apartment");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(deleteApartment(apartment.id) as any);
      toast.success("Apartment deleted successfully");
      setDeleteLoading(false);
      router.push("/apartments");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete apartment");
      setDeleteLoading(false);
    }
  };

  // Format dates
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
        <div>
          <div className="text-sm text-gray-700 font-semibold">Unit Number</div>
          <div className="mb-2 text-lg">{apartment.unitNumber}</div>
        </div>
        <div>
          <div className="text-sm text-gray-700 font-semibold">Project</div>
          <div className="mb-2 text-lg">{apartment.project}</div>
        </div>
        <div>
          <div className="text-sm text-gray-700 font-semibold">Address</div>
          <div className="mb-2 text-lg">{apartment.address}</div>
        </div>
        <div>
          <div className="text-sm text-gray-700 font-semibold">Bedrooms</div>
          <div className="mb-2 text-lg">{apartment.bedrooms}</div>
        </div>
        <div>
          <div className="text-sm text-gray-700 font-semibold">Bathrooms</div>
          <div className="mb-2 text-lg">{apartment.bathrooms}</div>
        </div>
        <div>
          <div className="text-sm text-gray-700 font-semibold">Price</div>
          <div className="mb-2 text-lg">${apartment.price}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-sm text-gray-700 font-semibold">Description</div>
          <div className="mb-2 text-base text-gray-800">{apartment.description}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Created: {formatDate(apartment.createdAt)}</div>
          <div className="text-xs text-gray-500">Updated: {formatDate(apartment.updatedAt)}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button size="icon" variant="ghost" aria-label="Edit Apartment" onClick={() => setEditOpen(true)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Delete Apartment" onClick={() => setDeleteConfirm(true)}>
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
        {/* Edit Dialog */}
        <ApartmentFormDialog
          open={editOpen}
          setOpen={setEditOpen}
          onSubmit={handleEdit}
          loading={editLoading}
          error={editError}
          initialValues={{
            unitName: apartment.unitName,
            unitNumber: apartment.unitNumber,
            project: apartment.project,
            address: apartment.address,
            bedrooms: String(apartment.bedrooms),
            bathrooms: String(apartment.bathrooms),
            price: String(apartment.price),
            description: apartment.description,
          }}
        />
        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <div className="font-semibold mb-2">Delete Apartment</div>
              <div className="text-gray-700 mb-4">Are you sure you want to delete this apartment? This action cannot be undone.</div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirm(false)} disabled={deleteLoading}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
