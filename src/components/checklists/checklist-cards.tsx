import { useState, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Filter, Search, Plus, X } from "lucide-react";

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

interface ChecklistCardProps {
  name: string;
  description: string;
}

function ChecklistCard({name, description}: ChecklistCardProps) {   
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border border-border bg-card"
    >
      <CardContent className="h-full flex flex-col">
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

export default function ChecklistsGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Extract categories from checklist names for filtering
  const categories = useMemo(() => {
    const cats = new Set<string>();
    mockChecklists.forEach(checklist => {
      if (checklist.name.toLowerCase().includes('paediatric') || checklist.name.toLowerCase().includes('pediatric')) {
        cats.add('pediatric');
      } else if (checklist.name.toLowerCase().includes('emergency')) {
        cats.add('emergency');
      } else if (checklist.name.toLowerCase().includes('trolley')) {
        cats.add('trolley');
      } else if (checklist.name.toLowerCase().includes('anaesthetic') || checklist.name.toLowerCase().includes('anesthetic')) {
        cats.add('anesthetic');
      } else {
        cats.add('other');
      }
    });
    return Array.from(cats).sort();
  }, []);

  // Filter checklists based on search term and category
  const filteredChecklists = useMemo(() => {
    return mockChecklists.filter(checklist => {
      const matchesSearch = searchTerm === "" || 
        checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || 
        (categoryFilter === 'pediatric' && (checklist.name.toLowerCase().includes('paediatric') || checklist.name.toLowerCase().includes('pediatric'))) ||
        (categoryFilter === 'emergency' && checklist.name.toLowerCase().includes('emergency')) ||
        (categoryFilter === 'trolley' && checklist.name.toLowerCase().includes('trolley')) ||
        (categoryFilter === 'anesthetic' && (checklist.name.toLowerCase().includes('anaesthetic') || checklist.name.toLowerCase().includes('anesthetic'))) ||
        (categoryFilter === 'other' && !checklist.name.toLowerCase().includes('paediatric') && !checklist.name.toLowerCase().includes('pediatric') && !checklist.name.toLowerCase().includes('emergency') && !checklist.name.toLowerCase().includes('trolley') && !checklist.name.toLowerCase().includes('anaesthetic') && !checklist.name.toLowerCase().includes('anesthetic'));

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b bg-background">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Checklists</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredChecklists.length} of {mockChecklists.length} checklists
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search checklists..." 
              className="pl-9 w-64 pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="border-b bg-muted/30 p-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Category:</span>
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("all")}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="flex-1 p-6">
        {filteredChecklists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No checklists found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? `No results for "${searchTerm}"` : "No checklists match the selected filters"}
            </p>
            {(searchTerm || categoryFilter !== "all") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredChecklists.map((checklist: Checklist) => (
              <ChecklistCard 
                key={checklist.id}
                name={checklist.name}
                description={checklist.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
