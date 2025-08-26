// FOR ENTERING A NEW CHECKLIST

import { useState } from "react";
import { useApi } from "../auth/useAuth";
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
    id: number; // Use the numeric ID
    title: string;
    items: ChecklistItem[];
  } | null;
}

export function ChecklistDialog({ isOpen, onClose, checklistData }: ChecklistDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { apiFetch, authorId } = useApi();

  const handleAnswerChange = (question: string, answer: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [question]: answer }));
  };

  const handleSubmit = async () => {
    if (!checklistData || !authorId) return;

    setIsSubmitting(true);
    const payload = {
      checklistId: checklistData.id,
      authorId: 1,
      answers: checklistData.items.map((item) => ({
        question: item.question,
        answer: answers[item.question] ?? "", // Default to empty string if no answer
      })),
    };

    try {
      await apiFetch(`https://curas.blac.dev/api/records`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      onClose(); // Close dialog on success
    } catch (error) {
      console.error("Failed to submit checklist record:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      <Checkbox
                        id={itemId}
                        onCheckedChange={(checked) => handleAnswerChange(item.question, !!checked)}
                      />
                      <Label htmlFor={itemId} className="font-normal">
                        {item.question}
                      </Label>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={itemId}>{item.question}</Label>
                      {item.type === "text" && <Input
                        id={itemId}
                        onChange={(e) => handleAnswerChange(item.question, e.target.value)}
                      />}
                      {item.type === "textarea" && <Textarea
                        id={itemId}
                        onChange={(e) => handleAnswerChange(item.question, e.target.value)}
                      />}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Checklist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
