import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", completed: 18 },
  { month: "Feb", completed: 24 },
  { month: "Mar", completed: 32 },
  { month: "Apr", completed: 40 },
  { month: "May", completed: 38 },
  { month: "Jun", completed: 55 },
];

const chartConfig = {
  completed: {
    label: "Tasks Completed",
    color: "hsl(var(--chart-1))",
  },
};

export function Overview() {
  return (
    <ChartContainer config={chartConfig} className="mt-6">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="4 4" className="stroke-muted" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          className="text-xs"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="completed"
          type="monotone"
          fill="var(--color-completed)"
          stroke="var(--color-completed)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

