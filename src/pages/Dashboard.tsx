import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <>
      <div className="p-4">
        <div className="flex flex-row flex-wrap gap-5 justify-center">
          <Card className="p-4 w-full lg:w-[30%]">CARD</Card>
          <Card className="p-4 w-full lg:w-[30%]">CARD</Card>
          <Card className="p-4 w-full lg:w-[30%]">CARD</Card>
        </div>
      </div>
    </>
  );
}
