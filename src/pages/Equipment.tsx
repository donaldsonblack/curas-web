import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "../components/ui/table";

const equipment = [
  { name: "Forklift", model: "FL100", status: "Active" },
  { name: "Generator", model: "GN200", status: "Maintenance" },
  { name: "Crane", model: "CR75", status: "Inactive" },
];

export default function Equipment() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Equipment</h1>
      <Table>
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
  );
}

