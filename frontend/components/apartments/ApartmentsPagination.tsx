import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface ApartmentsPaginationProps {
  page: number;
  setPage: (n: number) => void;
  totalPages: number;
}

export default function ApartmentsPagination({ page, setPage, totalPages }: ApartmentsPaginationProps) {
  if (totalPages <= 1) return null;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {pageNumbers.map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              href="#"
              isActive={n === page}
              onClick={e => { e.preventDefault(); setPage(n); }}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 