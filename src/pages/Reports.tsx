import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const reports = [
  {
    id: 1,
    title: "Monthly Usage",
    description: "Summary of system usage for March.",
  },
  {
    id: 2,
    title: "Inspection Results",
    description: "Latest equipment inspection outcomes.",
  },
];

export default function Reports() {
  return (
    <div className="p-6 grid gap-4 sm:grid-cols-2">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <CardTitle>{report.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {report.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

