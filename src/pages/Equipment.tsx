import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const equipment = [
  { name: "Forklift", model: "FL100", status: "Active" },
  { name: "Generator", model: "GN200", status: "Maintenance" },
  { name: "Crane", model: "CR75", status: "Inactive" },
];

export default function Equipment() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-4 text-2xl font-semibold">Equipment</h1>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.model}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>A list of equipment in the system.</TableCaption>
        </Table>
      </div>
    </div>
  );
}

