export interface checklistCardProps {
  id: number;
  name: string;
  title: string;
  description: string;
  questions: { type: string; question: string }[];
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChecklistDialog } from "./ChecklistDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function ChecklistCard({ id, title, description, questions }: checklistCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);

  const handleStartChecklist = () => {
    setSelectedChecklist({ id, title, items: questions });
    setIsDialogOpen(true);
  };

  return (
    <>
      <ChecklistDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        checklistData={selectedChecklist}
      />
                  <Card key={id} className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="grow">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartChecklist}>Start Checklist</Button>
        </CardFooter>
      </Card>
    </>
  );
}
