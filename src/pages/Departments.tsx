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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Departments</h1>
      <Table>
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
  );
}

