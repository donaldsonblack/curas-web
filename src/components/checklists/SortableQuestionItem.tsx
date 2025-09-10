// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
// // import { Question, QuestionType } from "./AddChecklistDialog";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
//
// interface SortableQuestionItemProps {
//   question: Question;
//   handleQuestionChange: (id: string, updatedQuestion: Partial<Question>) => void;
//   handleRemoveQuestion: (id: string) => void;
// }
//
// export function SortableQuestionItem({
//   question,
//   handleQuestionChange,
//   handleRemoveQuestion,
// }: SortableQuestionItemProps) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
//
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//
//   return (
//     <div ref={setNodeRef} style={style} className="flex items-start gap-2 p-3 border rounded-lg bg-background">
//       <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab touch-none">
//         <GripVertical className="h-5 w-5 text-muted-foreground" />
//       </Button>
//       <div className="flex-grow space-y-3">
//         <Input
//           type="text"
//           placeholder={`Question`}
//           value={question.text}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             handleQuestionChange(question.id, { text: e.target.value })
//           }
//         />
//         <Select
//           value={question.type}
//           onValueChange={(value: QuestionType) =>
//             handleQuestionChange(question.id, { type: value, options: [] })
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select question type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="text">Text</SelectItem>
//             <SelectItem value="dropdown">Dropdown</SelectItem>
//             <SelectItem value="checkbox">Checkbox</SelectItem>
//           </SelectContent>
//         </Select>
//         {question.type === "dropdown" && (
//           <div className="pl-4 border-l-2 space-y-2">
//             {question.options?.map((opt, optIndex) => (
//               <div key={optIndex} className="flex items-center gap-2">
//                 <Input
//                   type="text"
//                   placeholder={`Option ${optIndex + 1}`}
//                   value={opt}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     const newOptions = [...(question.options || [])];
//                     newOptions[optIndex] = e.target.value;
//                     handleQuestionChange(question.id, { options: newOptions });
//                   }}
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => {
//                     const newOptions = [...(question.options || [])];
//                     newOptions.splice(optIndex, 1);
//                     handleQuestionChange(question.id, { options: newOptions });
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4 text-muted-foreground" />
//                 </Button>
//               </div>
//             ))}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 const newOptions = [...(question.options || []), ""];
//                 handleQuestionChange(question.id, { options: newOptions });
//               }}
//             >
//               <PlusCircle className="h-4 w-4 mr-2" />
//               Add Option
//             </Button>
//           </div>
//         )}
//       </div>
//       <Button variant="ghost" size="icon" onClick={() => handleRemoveQuestion(question.id)}>
//         <Trash2 className="h-4 w-4 text-destructive" />
//       </Button>
//     </div>
//   );
// }
