import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, X } from "lucide-react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useApi } from "../auth/useAuth";

const questionSchema = z.object({
  type: z.enum(["text", "number", "select", "multi-select", "checkbox"], { required_error: "Question type is required." }),
  question: z.string().min(1, "Question text cannot be empty."),
  options: z.array(z.object({ value: z.string().min(1, "Option cannot be empty.") })).optional(),
}).superRefine((data, ctx) => {
  if ((data.type === "select" || data.type === "multi-select") && (!data.options || data.options.length < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "Select and Multi-select questions must have at least one option.",
    });
  }
});

const checklistSchema = z.object({
  name: z.string().min(1, "Checklist name is required."),
  description: z.string().min(1, "Description is required."),
  equipmentName: z.string().min(1, "Equipment name is required."),
  equipmentModel: z.string().min(1, "Equipment model is required."),
  departmentName: z.string().min(1, "Department is required."),
  frequency: z.string().min(1, "Frequency is required."),
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

type ChecklistFormValues = z.infer<typeof checklistSchema>;

export default function AddChecklistDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { apiFetch } = useApi();

  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      name: "",
      description: "",
      equipmentName: "",
      equipmentModel: "",
      departmentName: "",
      frequency: "",
      questions: [{ type: "text", question: "", options: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (data: ChecklistFormValues) => {
    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/api/checklists/table`, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          createdDate: new Date().toISOString(),
        }),
      });
      console.log("Checklist created:", response);
      setIsOpen(false);
      form.reset();
      // Here you might want to trigger a refetch of the checklists data
    } catch (error) {
      console.error("Failed to create checklist:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Checklist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Checklist</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new checklist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Checklist Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select onValueChange={(value) => form.setValue("frequency", value)} defaultValue={form.getValues("frequency")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.frequency && <p className="text-sm text-red-500">{form.formState.errors.frequency.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipmentName">Equipment Name</Label>
              <Input id="equipmentName" {...form.register("equipmentName")} />
              {form.formState.errors.equipmentName && <p className="text-sm text-red-500">{form.formState.errors.equipmentName.message}</p>}
            </div>
            <div>
              <Label htmlFor="equipmentModel">Equipment Model</Label>
              <Input id="equipmentModel" {...form.register("equipmentModel")} />
              {form.formState.errors.equipmentModel && <p className="text-sm text-red-500">{form.formState.errors.equipmentModel.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="departmentName">Department</Label>
            <Select onValueChange={(value) => form.setValue("departmentName", value)} defaultValue={form.getValues("departmentName")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Radiology">Radiology</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Oncology">Oncology</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.departmentName && <p className="text-sm text-red-500">{form.formState.errors.departmentName.message}</p>}
          </div>

          <div>
            <Label>Questions</Label>
            <div className="space-y-3 pt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 p-3 border rounded-lg bg-slate-50/50">
                  <div className="grid gap-3 flex-grow">
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <Select
                        onValueChange={(value: 'text' | 'number' | 'select' | 'multi-select' | 'checkbox') => {
                          form.setValue(`questions.${index}.type`, value)
                        }}
                        defaultValue={field.type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="multi-select">Multi-select</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder={`Question ${index + 1}`}
                      {...form.register(`questions.${index}.question`)}
                      className="bg-white"
                    />
                    {form.formState.errors.questions?.[index]?.question && <p className="text-sm text-red-500">{form.formState.errors.questions?.[index]?.question?.message}</p>}
                    
                    {(form.watch(`questions.${index}.type`) === 'select' || form.watch(`questions.${index}.type`) === 'multi-select') && (
                      <OptionsField control={form.control} nestIndex={index} />
                    )}
                  </div>

                </div>
              ))}
            </div>
            {form.formState.errors.questions && !form.formState.errors.questions.root && <p className="text-sm text-red-500 mt-1">{form.formState.errors.questions.message}</p>}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => append({ type: "text", question: "", options: [] })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Checklist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OptionsField({ nestIndex, control }: { nestIndex: number, control: any }) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions[${nestIndex}].options`
  });

  return (
    <div className="pl-4 border-l-2 border-slate-200 space-y-2">
      <Label className="text-sm font-medium">Options</Label>
      {fields.map((item, k) => (
        <div key={item.id} className="flex items-center gap-2">
          <Input
            placeholder={`Option ${k + 1}`}
            {...control.register(`questions[${nestIndex}].options[${k}].value`)}
            className="bg-white h-9"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(k)}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ value: "" })}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Option
      </Button>
    </div>
  )
}
