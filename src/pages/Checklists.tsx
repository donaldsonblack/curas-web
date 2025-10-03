import { Card } from "@/components/ui/card";

export default function Checklists() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-5 bg-gray-300 p-4 ">

        <div className="bg-green-300">
          <h1 className="">CHECKLISTS</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          </Card>

        </div>

      </div>
    </div>
  );
}