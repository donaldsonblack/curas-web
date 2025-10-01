import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Dashboard() {
  const handleCard1Click = () => {
    toast.success("Card 1 clicked!", {
      description: "This is the first card action",
      position: "bottom-right",
    });
  };

  const handleCard2Click = () => {
    toast.info("Card 2 clicked!", {
      description: "This is the second card action", 
      position: "bottom-right",
    });
  };

  const handleCard3Click = () => {
    toast.warning("Card 3 clicked!", {
      description: "This is the third card action",
      position: "bottom-right", 
    });
  };

  return (
    <>
      <div className="p-4">
        <div className="flex flex-row flex-wrap gap-5 justify-center">
          <Card 
            className="p-4 w-full lg:w-[30%] cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={handleCard1Click}
          >
            CARD 1
          </Card>
          <Card 
            className="p-4 w-full lg:w-[30%] cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={handleCard2Click}
          >
            CARD 2
          </Card>
          <Card 
            className="p-4 w-full lg:w-[30%] cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={handleCard3Click}
          >
            CARD 3
          </Card>
        </div>
      </div>
    </>
  );
}
