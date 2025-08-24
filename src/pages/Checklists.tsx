import { useMemo, useState } from "react";
import AddChecklistDialog from "../components/addChecklistDialog";
import { useAdmin } from "../hooks/useAdmin";
import type { ChecklistItem } from "../components/checklistCardHandler";
import ChecklistCardHandler from "../components/checklistCardHandler";
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Checklists() {
  const { data, loading, error, refetch } = useChecklistTableData();
  const isAdmin = useAdmin();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "name">("title");

  const items: ChecklistItem[] = (data || []).map((row, idx) => {
    const equipLabel = [row.equipmentName, row.equipmentModel].filter(Boolean).join(" – ");
    const id = `CL-${slugify(row.equipmentName || "equip")}-${slugify(row.frequency || "freq")}-${idx + 1}`;

    return {
      id,
      name: equipLabel || row.equipmentName || "Equipment",
      title: row.name || `${row.frequency} Checklist`,
      description: row.description || "",
      questions: row.questions || [], // Corrected data mapping
    } as ChecklistItem;
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
      return a.id.localeCompare(b.id);
    });

    return sorted;
  }, [query, sortBy, items]);
  
  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading checklists…</div>
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
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search checklists..."
              className="w-64 pl-9"
            />
          </div>
          <Select onValueChange={(value) => setSortBy(value as any)} defaultValue={sortBy}>
            <SelectTrigger className="w-[180px]">
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