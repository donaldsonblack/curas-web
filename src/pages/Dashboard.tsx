import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <>
      <div className="h-screen border-red-500 border-2 ">
        <div className="block sm:flex sm:justify-between p-4 space-y-1">
          <div className="w-full sm:w-[32%] bg-gray-200 p-4">Card 1</div>
          <div className="w-full sm:w-[32%] bg-gray-200 p-4">Card 2</div>
          <div className="w-full sm:w-[32%] bg-gray-200 p-4">Card 3</div>
        </div>
      </div>
    </>
  );
}
