import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { toast } from "sonner";


export default function DashboardKpiCards() {
    const handleCard1Click = () => {
        toast.success("Analytics clicked!", {
          description: "Viewing analytics dashboard",
          position: "bottom-right",
        });
      };
    
      const handleCard2Click = () => {
        toast.info("Users clicked!", {
          description: "Managing user accounts", 
          position: "bottom-right",
        });
      };
    
      const handleCard3Click = () => {
        toast.warning("Settings clicked!", {
          description: "Accessing system settings",
          position: "bottom-right", 
        });
      };
    
      const handleInfoClick = (cardName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toast.info(`${cardName} Info`, {
          description: `More information about ${cardName.toLowerCase()}`,
          position: "bottom-right",
        });
      };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={handleCard1Click}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Checklists</CardTitle>
                <button 
                  onClick={(e) => handleInfoClick("Views", e)}
                  className="h-4 w-4 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Info className="h-2.5 w-2.5 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">9</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={handleCard2Click}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Checklists</CardTitle>
                <button 
                  onClick={(e) => handleInfoClick("Unique viewers", e)}
                  className="h-4 w-4 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Info className="h-2.5 w-2.5 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">2</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={handleCard3Click}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total time spent</CardTitle>
                <button 
                  onClick={(e) => handleInfoClick("Total time watched", e)}
                  className="h-4 w-4 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Info className="h-2.5 w-2.5 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">02:12</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}