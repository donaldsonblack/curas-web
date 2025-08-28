import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "../components/ui/table";

const departments = [
  { name: "Maintenance", manager: "Alice Johnson" },
  { name: "Operations", manager: "Bob Smith" },
  { name: "Safety", manager: "Carol Lee" },
];

export default function Departments() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-4 text-2xl font-semibold">Departments</h1>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.name}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.manager}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>A list of company departments.</TableCaption>
        </Table>
      </div>
    </div>
  );
}

