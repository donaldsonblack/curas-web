import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

export default function Dashboard() {
  const stats = [
    { label: "Total Users", value: 42 },
    { label: "Departments", value: 5 },
    { label: "Active Checklists", value: 23 },
    { label: "Equipment", value: 12 },
  ];

  return (
    <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle>{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

