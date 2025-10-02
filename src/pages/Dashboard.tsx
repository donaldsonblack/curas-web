import DashboardKpiCards from "@/components/dashboard/dashboard-kpi-cards";
import DashboardMainGraph from "@/components/dashboard/dashboard-main-graph";

export default function Dashboard() {
  return (
    <>
      <div className="p-10 space-y-5 ">

        <DashboardKpiCards />

        <div className="mb-8 flex flex-wrap bg-grey-light">
          

          <div className="border-8 w-full lg:w-1/2 bg-grey">
            <DashboardMainGraph />
          </div>

          <div className="border-8 w-full md:w-1/2 lg:w-1/4 bg-grey"></div>
          <div className="border-8 w-full md:w-1/2 lg:w-1/4 bg-grey"></div>
          </div>
        
      </div>
    </>
  );
}
