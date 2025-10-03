import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Plus } from "lucide-react";

// Mock data for checklist cards
const mockChecklists = [
  { id: 1, name: "Tracheostomy Emergency Pack Contents" },
  { id: 2, name: "TAVI Trolley" },
  { id: 3, name: "SHUR - Resuscitation equipment daily checklist" },
  { id: 4, name: "Paediatric Trolley" },
  { id: 5, name: "Paediatric Emergency Trolley (Responses)" },
  { id: 6, name: "Paediatric Emergency Trolley" },
  { id: 7, name: "OTF Paediatric Airway Bag" },
  { id: 8, name: "OTF EMERGENCY/BLEEDING BOX" },
  { id: 9, name: "OTF ADULT AIRWAY BAG CONTENTS" },
  { id: 10, name: "Off Floor/Spare Anaesthetic machine checks" },
  { id: 11, name: "MRI Trolley" },
  { id: 12, name: "Midline Trolley" },
  { id: 13, name: "Malignant Hyperthermia Trolley" },
  { id: 14, name: "Holding bay-Anaesthetic Machine and Equipment" },
  { id: 15, name: "End of shift check- Anaesthetic Nursing" }
];

interface Checklist {
  id: number;
  name: string;
}

export default function Checklists() {
  return (
    <div className="flex flex-col h-full">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b bg-background">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Checklists</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search checklists..." 
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {mockChecklists.map((checklist: Checklist) => (
            <Card 
              key={checklist.id} 
              className="hover:shadow-md transition-shadow cursor-pointer border border-border bg-card"
            >
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-card-foreground leading-tight">
                  {checklist.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}