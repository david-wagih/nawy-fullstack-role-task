"use client";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ApartmentsFilters from "@/components/apartments/ApartmentsFilters";
import ApartmentsGrid from "@/components/apartments/ApartmentsGrid";
import ApartmentsPagination from "@/components/apartments/ApartmentsPagination";
import {
  useAppDispatch,
  useAppSelector,
  fetchApartments,
  selectApartments,
  selectApartmentsLoading,
  selectApartmentsError,
} from "../../store/store";

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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Apartments</h1>
        <Button>Add Apartment</Button>
      </div>
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
          <ApartmentsGrid apartments={paginated} />
          <div className="flex justify-center mt-8">
            <ApartmentsPagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
} 