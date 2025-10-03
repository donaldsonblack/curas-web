import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Clock, User, AlertTriangle, CheckCircle2 } from "lucide-react";

// Mock checklist data - would come from API in real app
const mockChecklistData = {
  1: {
    id: 1,
    name: "Tracheostomy Emergency Pack Contents",
    description: "Essential emergency equipment for tracheostomy procedures",
    category: "emergency",
    estimatedTime: "5-10 minutes",
    items: [
      { id: 1, text: "Suction catheter (size 10, 12, 14)", required: true },
      { id: 2, text: "Tracheostomy tube (same size as patient's current tube)", required: true },
      { id: 3, text: "Tracheostomy tube (one size smaller)", required: true },
      { id: 4, text: "10ml syringe for cuff inflation", required: true },
      { id: 5, text: "Tracheal dilators", required: true },
      { id: 6, text: "Scissors", required: true },
      { id: 7, text: "Spare inner cannula", required: false },
      { id: 8, text: "Lubricating jelly", required: false },
      { id: 9, text: "Gloves (sterile)", required: true },
      { id: 10, text: "Gauze swabs", required: false }
    ]
  },
  2: {
    id: 2,
    name: "TAVI Trolley",
    description: "Transcatheter aortic valve implantation equipment checklist",
    category: "trolley",
    estimatedTime: "15-20 minutes",
    items: [
      { id: 1, text: "TAVI delivery system", required: true },
      { id: 2, text: "Balloon catheter for pre-dilatation", required: true },
      { id: 3, text: "Contrast medium", required: true },
      { id: 4, text: "Guidewires (various sizes)", required: true },
      { id: 5, text: "Introducer sheaths", required: true },
      { id: 6, text: "Hemostatic devices", required: true },
      { id: 7, text: "Emergency medications", required: true },
      { id: 8, text: "Backup pacing leads", required: false }
    ]
  }
};

interface ChecklistItem {
  id: number;
  text: string;
  required: boolean;
}

interface ChecklistData {
  id: number;
  name: string;
  description: string;
  category: string;
  estimatedTime: string;
  items: ChecklistItem[];
}

export default function ChecklistEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get checklist data (fallback to first checklist if ID not found)
  const checklistId = parseInt(id || "1");
  const checklist: ChecklistData = mockChecklistData[checklistId as keyof typeof mockChecklistData] || mockChecklistData[1];
  
  // State for tracking completed items and notes
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (itemId: number) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const requiredItems = checklist.items.filter(item => item.required);
  const optionalItems = checklist.items.filter(item => !item.required);
  const completedRequired = requiredItems.filter(item => completedItems.has(item.id)).length;
  const totalRequired = requiredItems.length;
  const isComplete = completedRequired === totalRequired;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Checklist submitted:", {
      checklistId: checklist.id,
      completedItems: Array.from(completedItems),
      notes,
      timestamp: new Date().toISOString()
    });
    setIsSubmitting(false);
    navigate("/checklists");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'trolley': return 'bg-green-100 text-green-800';
      case 'pediatric': return 'bg-blue-100 text-blue-800';
      case 'anesthetic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/checklists")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Checklists
        </Button>
      </div>

      {/* Checklist Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{checklist.name}</CardTitle>
                <Badge className={`capitalize ${getCategoryColor(checklist.category)}`}>
                  {checklist.category}
                </Badge>
              </div>
              <p className="text-muted-foreground">{checklist.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {checklist.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Current User
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {completedRequired}/{totalRequired}
              </div>
              <div className="text-sm text-muted-foreground">Required Items</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            )}
            <span className="font-medium">
              {isComplete ? "All required items completed" : `${totalRequired - completedRequired} required items remaining`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isComplete ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${(completedRequired / totalRequired) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Required Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Required Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requiredItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border">
              <Checkbox
                id={`required-${item.id}`}
                checked={completedItems.has(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <label
                htmlFor={`required-${item.id}`}
                className={`flex-1 text-sm cursor-pointer ${
                  completedItems.has(item.id) ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.text}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optional Items */}
      {optionalItems.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Optional Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optionalItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <Checkbox
                  id={`optional-${item.id}`}
                  checked={completedItems.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label
                  htmlFor={`optional-${item.id}`}
                  className={`flex-1 text-sm cursor-pointer ${
                    completedItems.has(item.id) ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {item.text}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notes & Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any notes, observations, or issues encountered..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Submit Section */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/checklists")}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? "Submitting..." : "Complete Checklist"}
          {isComplete && <CheckCircle2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
