import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

// Define the structure of a single checklist item/question
interface ChecklistItem {
  question: string;
  type: 'text' | 'textarea' | 'boolean';
}

// Define the props for the ChecklistDialog component
interface ChecklistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  checklistData: {
    title: string;
    items: ChecklistItem[];
  } | null;
}

export function ChecklistDialog({ isOpen, onClose, checklistData }: ChecklistDialogProps) {
  if (!checklistData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{checklistData.title}</DialogTitle>
          <DialogDescription>
            Please complete the checklist below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {checklistData.items.map((item, index) => {
            const itemId = `question-${index}`;
            return (
              <Card key={itemId}>
                <CardContent className="px-6 py-2">
                  {item.type === "boolean" ? (
                    <div className="flex items-center space-x-3">
                      <Checkbox id={itemId} />
                      <Label htmlFor={itemId} className="font-normal">
                        {item.question}
                      </Label>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={itemId}>{item.question}</Label>
                      {item.type === "text" && <Input id={itemId} />}
                      {item.type === "textarea" && <Textarea id={itemId} />}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
