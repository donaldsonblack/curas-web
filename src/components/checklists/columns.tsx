"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type Checklist = {
  id: number;
  name: string;
  type: string;
  description: string;
  departmentId: number;
  equipmentId: number;
  authorId: number;
  created: string;
};

export const columns: ColumnDef<Checklist>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "departmentId",
    header: "Department",
  },
  {
    accessorKey: "equipmentId",
    header: "Equipment",
  },
  {
    accessorKey: "authorId",
    header: "Author",
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
];
