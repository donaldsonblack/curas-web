import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activities = [
  {
    user: "Alex Johnson",
    action: "Logged sterilizer calibration",
    initials: "AJ",
    time: "2h ago",
  },
  {
    user: "Maria Chen",
    action: "Completed safety inspection",
    initials: "MC",
    time: "1d ago",
  },
  {
    user: "Sam Patel",
    action: "Filed incident report",
    initials: "SP",
    time: "3d ago",
  },
  {
    user: "Lisa Wong",
    action: "Updated compliance checklist",
    initials: "LW",
    time: "1w ago",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((item) => (
        <div key={item.user + item.time} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{item.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.user}</p>
            <p className="text-sm text-muted-foreground">{item.action}</p>
          </div>
          <div className="ml-auto font-medium text-sm">
            {item.time}
          </div>
        </div>
      ))}
    </div>
  );
}

