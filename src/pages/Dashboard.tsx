import DashboardKpiCards from "@/components/dashboard/dashboard-kpi-cards";
import DashboardMainGraph from "@/components/dashboard/dashboard-main-graph";

export default function Dashboard() {
  return (
    <>
      <div className="p-10 space-y-5 ">

        <DashboardKpiCards />

        <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-0 bg-grey-light">
          <div className="border-8 lg:col-span-2 bg-grey">
            <DashboardMainGraph />
          </div>

          <div className="border-8 lg:col-span-1 bg-grey"></div>
          <div className="border-8 lg:col-span-1 bg-grey"></div>
        </div>
        
      </div>
    </>
  );
}
