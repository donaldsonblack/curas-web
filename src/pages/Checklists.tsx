"use client";

import * as React from "react";
import DataTable from "@/components/checklists/data-table";
import { type Checklist } from "@/components/checklists/columns";
import { useApi } from "@/auth/useAuth";
import { signoutRedirect } from "@/auth/useAuth";
import { columns } from "@/components/checklists/columns";

type ApiResponse = {
  content: Checklist[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export default function Checklists() {
  const { apiFetch } = useApi();
  const [data, setData] = React.useState<Checklist[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const json = (await apiFetch("/api/checklists")) as ApiResponse;
        if (!cancelled) setData(json?.content ?? []);
      } catch (e: any) {
        if (!cancelled) {
          // optional: auto-logout on 401/403
          const msg = String(e?.message ?? "");
          if (msg.includes("401") || msg.includes("403")) {
            setError("Your session has expired. Redirecting to sign out…");
            // small delay so the user can see the message
            setTimeout(() => signoutRedirect(), 500);
          } else {
            setError(msg || "Failed to load checklists");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiFetch]);

  if (loading)
    return (
      <div className="text-sm text-muted-foreground p-4">
        Loading checklists…
      </div>
    );
  if (error)
    return <div className="text-sm text-destructive p-4">Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Checklists</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
