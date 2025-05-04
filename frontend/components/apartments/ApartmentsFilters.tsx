import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ApartmentsFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
  bedroomOptions: number[];
  project: string;
  setProject: (v: string) => void;
  projectOptions: string[];
}

export default function ApartmentsFilters({
  search,
  setSearch,
  bedrooms,
  setBedrooms,
  bedroomOptions,
  project,
  setProject,
  projectOptions,
}: ApartmentsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <Input
        placeholder="Search by name, number, address, project..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 flex-grow"
      />
      <Select value={bedrooms || "all"} onValueChange={setBedrooms}>
        <SelectTrigger className="w-full md:w-32">Bedrooms</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Bedrooms</SelectItem>
          {bedroomOptions.map((b) => (
            <SelectItem key={b} value={String(b)}>{b} BR</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={project || "all"} onValueChange={setProject}>
        <SelectTrigger className="w-full md:w-40">Project</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projectOptions.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 