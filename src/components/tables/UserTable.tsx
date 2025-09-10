import { type ColumnDef } from "@tanstack/react-table"
import { useUsersTableData, type User } from "@/hooks/useUsersTableData"
import { DataTable } from "@/components/ui/data-table"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "departments",
    header: "Departments",
    cell: ({ row }) => {
      const departments = row.getValue("departments") as string[]
      return departments.join(", ")
    },
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => {
      const created = row.getValue("created") as string
      return new Date(created).toLocaleDateString()
    },
  },
]

export default function UserTable() {
  const { data, loading, error } = useUsersTableData()

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return <DataTable columns={columns} data={data} filterColumn="email" />
}

