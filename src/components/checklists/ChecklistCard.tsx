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
} from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChecklistDialog } from "./ChecklistDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useApi } from "../../auth/useAuth";

export default function ChecklistCard({ id, title, description, questions }: checklistCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const { apiFetch } = useApi();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleStartChecklist = () => {
    setSelectedChecklist({ id, title, items: questions });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/api/checklists/${id}`, {
        method: "DELETE",
      });
      // Optionally, trigger a data refresh here
    } catch (error) {
      console.error(`Failed to delete checklist with id ${id}:`, error);
    }
    setIsAlertOpen(false);
  };

  return (
    <>
      <ChecklistDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        checklistData={selectedChecklist}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              checklist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setIsAlertOpen(true)}
                >
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
