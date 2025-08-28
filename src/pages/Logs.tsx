import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "../components/ui/table";

const logs = [
  {
    id: 1,
    time: "2024-01-12 10:15",
    user: "Alice",
    action: "Logged in",
  },
  {
    id: 2,
    time: "2024-01-12 10:45",
    user: "Bob",
    action: "Created checklist",
  },
  {
    id: 3,
    time: "2024-01-12 11:05",
    user: "Carol",
    action: "Deleted equipment",
  },
];

export default function Logs() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Logs</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.time}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>A log of recent activities.</TableCaption>
      </Table>
    </div>
  );
}

