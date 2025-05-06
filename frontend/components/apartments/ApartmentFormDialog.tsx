"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApartmentFormValues } from "@/types/apartment";



interface ApartmentFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: ApartmentFormValues) => void;
  loading?: boolean;
  error?: string | null;
  initialValues?: Partial<ApartmentFormValues>;
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
}: ApartmentFormDialogProps) {
  const [values, setValues] = useState<ApartmentFormValues>({ ...defaultValues, ...initialValues });

  useEffect(() => {
    if (open) {
      setValues({ ...defaultValues, ...initialValues });
    }
    // Only depend on open and initialValues to avoid infinite loop
  }, [open, initialValues]);

  const handleChange = (field: keyof ApartmentFormValues, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.unitName || !values.unitNumber || !values.project || !values.address || !values.bedrooms || !values.bathrooms || !values.price) return;
    onSubmit(values);
  };

  const isValid = values.unitName && values.unitNumber && values.project && values.address && values.bedrooms && values.bathrooms && values.price;
  const isEdit = initialValues && Object.keys(initialValues).length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Apartment" : "Add Apartment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Unit Name"
            value={values.unitName}
            onChange={e => handleChange("unitName", e.target.value)}
            required
          />
          <Input
            placeholder="Unit Number"
            value={values.unitNumber}
            onChange={e => handleChange("unitNumber", e.target.value)}
            required
          />
          <Input
            placeholder="Project"
            value={values.project}
            onChange={e => handleChange("project", e.target.value)}
            required
          />
          <Input
            placeholder="Address"
            value={values.address}
            onChange={e => handleChange("address", e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Input
              placeholder="Bedrooms"
              type="number"
              min={0}
              value={values.bedrooms}
              onChange={e => handleChange("bedrooms", e.target.value)}
              required
            />
            <Input
              placeholder="Bathrooms"
              type="number"
              min={0}
              value={values.bathrooms}
              onChange={e => handleChange("bathrooms", e.target.value)}
              required
            />
          </div>
          <Input
            placeholder="Price"
            type="number"
            min={0}
            value={values.price}
            onChange={e => handleChange("price", e.target.value)}
            required
          />
          <Input
            placeholder="Description"
            value={values.description}
            onChange={e => handleChange("description", e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={!isValid || loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Apartment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 