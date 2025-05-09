"use client";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApartmentFormValues } from "@/types/apartment";



interface ApartmentFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: ApartmentFormValues) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
  initialValues?: Partial<ApartmentFormValues>;
  apartmentId?: string;
  onImagesUploaded?: (images: string[]) => void;
}

const defaultValues: ApartmentFormValues = {
  unitName: "",
  unitNumber: "",
  project: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  price: "",
  description: "",
};

export default function ApartmentFormDialog({
  open,
  setOpen,
  onSubmit,
  loading,
  error,
  initialValues = {},
  apartmentId,
  onImagesUploaded,
}: ApartmentFormDialogProps) {
  const [values, setValues] = useState<ApartmentFormValues>({ ...defaultValues, ...initialValues });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({ ...defaultValues, ...initialValues });
    }
    // Only depend on open to avoid infinite loop
  }, [open]);

  const handleChange = (field: keyof ApartmentFormValues, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.unitName || !values.unitNumber || !values.project || !values.address || !values.bedrooms || !values.bathrooms || !values.price) return;
    await onSubmit(values);
    // If editing and files selected, upload images
    if (apartmentId && fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      setUploading(true);
      const formData = new FormData();
      Array.from(fileInputRef.current.files).forEach(file => formData.append('images', file));
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apartments/${apartmentId}/images`, {
          method: 'POST',
          body: formData,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (res.ok) {
          const { data } = await res.json();
          if (onImagesUploaded && data && data.images) {
            onImagesUploaded(data.images);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          // Optionally show error message
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const isValid = values.unitName && values.unitNumber && values.project && values.address && values.bedrooms && values.bathrooms && values.price;
  const isEdit = initialValues && Object.keys(initialValues).length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto overflow-x-hidden max-h-[90vh] max-w-full p-4 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-center">{isEdit ? "Edit Apartment" : "Add Apartment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-4 w-full max-w-full">
          <Input
            placeholder="Unit Name"
            value={values.unitName}
            onChange={e => handleChange("unitName", e.target.value)}
            required
            className="w-full"
          />
          <Input
            placeholder="Unit Number"
            value={values.unitNumber}
            onChange={e => handleChange("unitNumber", e.target.value)}
            required
            className="w-full"
          />
          <Input
            placeholder="Project"
            value={values.project}
            onChange={e => handleChange("project", e.target.value)}
            required
            className="w-full"
          />
          <Input
            placeholder="Address"
            value={values.address}
            onChange={e => handleChange("address", e.target.value)}
            required
            className="w-full"
          />
          <div className="flex gap-2 w-full max-w-full">
            <Input
              placeholder="Bedrooms"
              type="number"
              min={0}
              value={values.bedrooms}
              onChange={e => handleChange("bedrooms", e.target.value)}
              required
              className="w-full"
            />
            <Input
              placeholder="Bathrooms"
              type="number"
              min={0}
              value={values.bathrooms}
              onChange={e => handleChange("bathrooms", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Input
            placeholder="Price"
            type="number"
            min={0}
            value={values.price}
            onChange={e => handleChange("price", e.target.value)}
            required
            className="w-full"
          />
          <Input
            placeholder="Description"
            value={values.description}
            onChange={e => handleChange("description", e.target.value)}
            className="w-full"
          />
          {isEdit && (
            <div className="w-full flex flex-col gap-1 mt-2">
              <label className="font-medium text-gray-700">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="block border rounded p-2 mt-1 w-full"
                disabled={uploading}
              />
            </div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={!isValid || loading || uploading}>
              {(loading || uploading) ? "Saving..." : isEdit ? "Save Changes" : "Add Apartment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 