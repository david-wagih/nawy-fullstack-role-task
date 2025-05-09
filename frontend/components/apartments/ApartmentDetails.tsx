"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import ApartmentFormDialog from "./ApartmentFormDialog";
import { useAppDispatch } from "@/store/store";
import { updateApartment, deleteApartment } from "@/store/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Apartment, ApartmentFormValues } from "@/types/apartment";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ApartmentDetailsClient({ apartment }: { apartment: Apartment }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [images, setImages] = useState<string[]>(apartment.images || []);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const handleEdit = async (values: ApartmentFormValues) => {
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
      }));
      // Fetch updated apartment data (including images)
      const apiUrl = typeof window === "undefined"
      ? process.env.INTERNAL_API_URL
      : process.env.NEXT_PUBLIC_API_URL;
    console.log('DEBUG: API_URL =', apiUrl);
      const res = await fetch(`${apiUrl}/apartments/${apartment.id}`, { cache: "no-store" });
      if (res.ok) {
        const { data } = await res.json();
        setImages(data.images || []);
      }
      toast.success("Apartment updated successfully");
      setEditOpen(false);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update apartment");
      toast.error(err instanceof Error ? err.message : "Failed to update apartment");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(deleteApartment(apartment.id));
      toast.success("Apartment deleted successfully");
      setDeleteLoading(false);
      router.push("/apartments");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete apartment");
      setDeleteLoading(false);
    }
  };

  // Handler to update images after image upload in the edit modal
  const handleImagesUploaded = async () => {
    console.log("handleImagesUploaded called");
    const apiUrl = typeof window === "undefined"
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL;
  console.log('DEBUG: API_URL =', apiUrl);
    const res = await fetch(`${apiUrl}/apartments/${apartment.id}`);
    const json = await res.json();
    console.log("Fetched apartment data after upload:", json);
    if (res.ok) {
      setImages(json.data.images || []);
    }
  };

  // Handler to delete an image
  const handleDeleteImage = async () => {
    if (!imageToDelete) return;
    const apiUrl = typeof window === "undefined"
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL;
  console.log('DEBUG: API_URL =', apiUrl);
    const res = await fetch(`${apiUrl}/apartments/${apartment.id}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageToDelete }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setImages(data.images || []);
    }
    setImageToDelete(null);
  };

  // Format dates
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <>
      {/* Header with edit/delete buttons */}
      <div className="flex justify-end gap-1 mb-4">
        <Button size="icon" variant="ghost" aria-label="Edit Apartment" onClick={() => setEditOpen(true)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Delete Apartment" onClick={() => setDeleteConfirm(true)}>
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </div>
      {/* Images Gallery */}
      {images.length > 0 && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => {
            const isServer = typeof window === "undefined";
            const apiUrl = isServer
              ? process.env.INTERNAL_API_URL
              : process.env.NEXT_PUBLIC_API_URL;
            const src = img.startsWith('http') ? img : `${apiUrl}${img}`;
            return (
              <div key={idx} className="relative w-full h-40 flex items-center justify-center bg-gray-100 rounded overflow-hidden group">
                <Image
                  src={src}
                  alt={`Apartment image ${idx + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority={idx === 0}
                  unoptimized
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 cursor-pointer z-10"
                  onClick={() => setImageToDelete(img)}
                  title="Delete image"
                >
                  <Trash className="w-5 h-5 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* Apartment info */}
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
        apartmentId={apartment.id}
        onImagesUploaded={handleImagesUploaded}
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
      {/* Image Delete Confirmation Dialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={open => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImageToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
