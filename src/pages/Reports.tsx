import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useApi } from "../auth/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

interface Record {
  id: string;
  checklistId: string;
  authorId: string;
  answers: any;
  created: string;
  updatedAt: string;
}

interface ChartData {
  date: string;
  checklists: number;
}

export default function Reports() {
  const [data, setData] = useState<ChartData[]>([]);
  const { apiFetch } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records: Record[] = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/record`
        );
        const processedData = processDataForChart(records);
        setData(processedData);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    fetchData();
  }, [apiFetch]);

  const processDataForChart = (records: Record[]): ChartData[] => {
    const countsByDate: { [key: string]: number } = {};

    records.forEach((record) => {
      // Truncate microseconds to milliseconds for robust parsing
      const truncatedDateString = record.created.substring(0, 23) + "Z";
      const date = new Date(truncatedDateString).toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
      if (countsByDate[date]) {
        countsByDate[date]++;
      } else {
        countsByDate[date] = 1;
      }
    });

    return Object.keys(countsByDate)
      .map((date) => ({
        date,
        checklists: countsByDate[date],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Checklists Completed Over Time</CardTitle>
          <CardDescription>
            A line chart showing the number of checklists completed each day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="min-h-[200px] w-full">
            <LineChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="checklists"
                type="monotone"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing daily checklist completion counts.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}