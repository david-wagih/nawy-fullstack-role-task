"use client";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ApartmentsFilters from "@/components/apartments/ApartmentsFilters";
import ApartmentsGrid from "@/components/apartments/ApartmentsGrid";
import ApartmentsPagination from "@/components/apartments/ApartmentsPagination";
import ApartmentFormDialog from "@/components/apartments/ApartmentFormDialog";
import {
  useAppDispatch,
  useAppSelector,
  fetchApartments,
  selectApartments,
  selectApartmentsLoading,
  selectApartmentsError,
  createApartment,
  updateApartment,
  deleteApartment,
} from "@/store/store";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
import { ApartmentFormValues } from "@/types/apartment";

const PAGE_SIZE = 6;

export default function ApartmentsPage() {
  const dispatch = useAppDispatch();
  const apartments = useAppSelector(selectApartments);
  const loading = useAppSelector(selectApartmentsLoading);
  const error = useAppSelector(selectApartmentsError);

  // Filters and search state
  const [search, setSearch] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [project, setProject] = useState("");
  const [page, setPage] = useState(1);

  // Add Apartment Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit Apartment Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<ApartmentFormValues> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Deletion dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  // Get unique projects for filter dropdown
  const projectOptions = useMemo(() => {
    const set = new Set(apartments.map((a) => a.project));
    return Array.from(set).filter(Boolean);
  }, [apartments]);

  // Filter, search, and paginate apartments
  const filtered = useMemo(() => {
    let filtered = apartments;
    if (search) {
      filtered = filtered.filter((a) =>
        a.unitName.toLowerCase().includes(search.toLowerCase()) ||
        a.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
        a.address.toLowerCase().includes(search.toLowerCase()) ||
        a.project.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (bedrooms && bedrooms !== "all") {
      filtered = filtered.filter((a) => String(a.bedrooms) === bedrooms);
    }
    if (project && project !== "all") {
      filtered = filtered.filter((a) => a.project === project);
    }
    return filtered;
  }, [apartments, search, bedrooms, project]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // Get unique bedroom counts for filter dropdown
  const bedroomOptions = useMemo(() => {
    const set = new Set(apartments.map((a) => a.bedrooms));
    return Array.from(set).filter(Boolean).sort((a, b) => a - b);
  }, [apartments]);

  // Handle add apartment submit
  const handleAddApartment = async (values: ApartmentFormValues) => {
    setAddLoading(true);
    setAddError(null);
    try {
      await dispatch(createApartment({
        ...values,
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        price: Number(values.price),
      }));
      toast.success("Apartment added successfully");
      setAddOpen(false);
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Failed to add apartment");
      toast.error(err instanceof Error ? err.message : "Failed to add apartment");
    } finally {
      setAddLoading(false);
    }
  };

  // Handle edit apartment
  const handleEdit = (id: string) => {
    const apt = apartments.find(a => a.id === id);
    if (!apt) return;
    setEditInitial({
      unitName: apt.unitName,
      unitNumber: apt.unitNumber,
      project: apt.project,
      address: apt.address,
      bedrooms: String(apt.bedrooms),
      bathrooms: String(apt.bathrooms),
      price: String(apt.price),
      description: apt.description,
    });
    setEditId(id);
    setEditOpen(true);
  };

  const handleEditApartment = async (values: ApartmentFormValues) => {
    if (!editId) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await dispatch(updateApartment({
        id: editId,
        updates: {
          ...values,
          bedrooms: Number(values.bedrooms),
          bathrooms: Number(values.bathrooms),
          price: Number(values.price),
        },
      }));
      toast.success("Apartment updated successfully");
      setEditOpen(false);
      setEditId(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update apartment");
      toast.error(err instanceof Error ? err.message : "Failed to update apartment");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete apartment
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteApartment(deleteId));
      toast.success("Apartment deleted successfully");
      setDeleteId(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete apartment");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Apartments</h1>
        <Button 
          variant="outline"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Apartment
        </Button>
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Apartment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this apartment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading} onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={deleteLoading} onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ApartmentFormDialog
        open={addOpen}
        setOpen={setAddOpen}
        onSubmit={handleAddApartment}
        loading={addLoading}
        error={addError}
      />
      <ApartmentFormDialog
        open={editOpen}
        setOpen={setEditOpen}
        onSubmit={handleEditApartment}
        loading={editLoading}
        error={editError}
        initialValues={editInitial as Partial<ApartmentFormValues> | undefined}
      />
      <ApartmentsFilters
        search={search}
        setSearch={(v) => { setSearch(v); setPage(1); }}
        bedrooms={bedrooms}
        setBedrooms={(v) => { setBedrooms(v); setPage(1); }}
        bedroomOptions={bedroomOptions}
        project={project}
        setProject={(v) => { setProject(v); setPage(1); }}
        projectOptions={projectOptions}
      />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : paginated.length === 0 ? (
        <div className="text-gray-500">No apartments found.</div>
      ) : (
        <>
          <ApartmentsGrid
            apartments={paginated}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <div className="flex justify-center mt-8">
            <ApartmentsPagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
} 