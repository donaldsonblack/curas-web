import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Plus } from "lucide-react";

// Mock data for checklist cards
const mockChecklists = [
  { id: 1, name: "Tracheostomy Emergency Pack Contents", description: "Essential emergency equipment for tracheostomy procedures" },
  { id: 2, name: "TAVI Trolley", description: "Transcatheter aortic valve implantation equipment checklist" },
  { id: 3, name: "SHUR - Resuscitation equipment daily checklist", description: "Daily verification of resuscitation equipment readiness" },
  { id: 4, name: "Paediatric Trolley", description: "Specialized equipment for pediatric emergency care" },
  { id: 5, name: "Paediatric Emergency Trolley (Responses)", description: "Response protocols for pediatric emergency situations" },
  { id: 6, name: "Paediatric Emergency Trolley", description: "Complete pediatric emergency equipment inventory" },
  { id: 7, name: "OTF Paediatric Airway Bag", description: "Pediatric airway management tools and supplies" },
  { id: 8, name: "OTF EMERGENCY/BLEEDING BOX", description: "Emergency bleeding control equipment and supplies" },
  { id: 9, name: "OTF ADULT AIRWAY BAG CONTENTS", description: "Adult airway management equipment inventory" },
  { id: 10, name: "Off Floor/Spare Anaesthetic machine checks", description: "Backup anesthetic equipment verification checklist" },
  { id: 11, name: "MRI Trolley", description: "MRI-compatible equipment and safety checklist" },
  { id: 12, name: "Midline Trolley", description: "Midline catheter insertion equipment checklist" },
  { id: 13, name: "Malignant Hyperthermia Trolley", description: "Emergency treatment for malignant hyperthermia episodes" },
  { id: 14, name: "Holding bay-Anaesthetic Machine and Equipment", description: "Pre-operative anesthetic equipment verification" },
  { id: 15, name: "End of shift check- Anaesthetic Nursing", description: "End-of-shift equipment and safety verification" }
];

interface Checklist {
  id: number;
  name: string;
  description: string;
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
              className="hover:shadow-md transition-shadow cursor-pointer border border-border bg-card "
            >
              <CardContent className=" h-full flex flex-col">
                <div className="">
                  <h3 className="text-sm font-semibold text-card-foreground leading-tight">
                    {checklist.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {checklist.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}