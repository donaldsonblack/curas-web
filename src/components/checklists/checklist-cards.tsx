import { Card, CardContent } from "../ui/card";

interface ChecklistCardProps {
  name: string;
  description: string;
}

export default function ChecklistCard({name, description}: ChecklistCardProps) {   
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border border-border bg-card"
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-card-foreground leading-tight">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
