import { useMemo, useState } from "react";
import AddChecklistDialog from "../components/checklists/AddChecklistDialog";
import { useAdmin } from "../hooks/useAdmin";
import type { ChecklistItem } from "../components/checklists/ChecklistCardHandler";
import ChecklistCardHandler from "../components/checklists/ChecklistCardHandler";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search } from "lucide-react";
import { useChecklistTableData } from "../hooks/useChecklistTableData";
import ChecklistCardSkeleton from "../components/checklists/ChecklistCardSkeleton";
import { Skeleton } from "../components/ui/skeleton";


export default function Checklists() {
  const { data, loading, error, refetch } = useChecklistTableData();
  const isAdmin = useAdmin();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "name">("title");

  const items: ChecklistItem[] = (data || []).map((row) => {
    const equipLabel = [row.equipmentName, row.equipmentModel].filter(Boolean).join(" – ");

    return {
      id: row.id,
      name: equipLabel || row.equipmentName || "Equipment",
      title: row.name || `${row.type} Checklist`,
      description: row.description || "",
      questions: row.questions || [],
    };
  });

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? items.filter((it) => {
          const name = it.name.toLowerCase();
          const title = it.title.toLowerCase();
          return name.includes(q) || title.includes(q);
        })
      : items;

    const sorted = filtered.sort((a, b) => {
      const key = sortBy === "name" ? "name" : "title";
      const av = a[key].toLowerCase();
      const bv = b[key].toLowerCase();
      if (av < bv) return -1;
      if (av > bv) return 1;
      // tie-break on the other field then id
      const altA = (sortBy === "name" ? a.title : a.name).toLowerCase();
      const altB = (sortBy === "name" ? b.title : b.name).toLowerCase();
      if (altA < altB) return -1;
      if (altA > altB) return 1;
      return a.id - b.id;
    });

    return sorted;
  }, [query, sortBy, items]);
  
  if (loading && !data?.length) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Toolbar Skeleton */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <Skeleton className="h-10 w-full sm:w-64" />
            <Skeleton className="h-10 w-full sm:w-[180px]" />
          </div>
        </div>
        {/* Grid Skeleton */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ChecklistCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">Failed to load checklists: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search checklists..."
              className="w-full pl-9 sm:w-64"
            />
          </div>
          <Select onValueChange={(value) => setSortBy(value as any)} defaultValue={sortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Sort by Title</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isAdmin && <AddChecklistDialog onChecklistCreated={refetch} />}
      </div>
      <ChecklistCardHandler items={filteredSorted} />
    </div>
  );
}