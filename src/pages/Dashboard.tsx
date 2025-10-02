import DashboardKpiCards from "@/components/dashboard/dashboard-kpi-cards";
import DashboardMainGraph from "@/components/dashboard/dashboard-main-graph";
import DashboardTestCard from "@/components/dashboard/dashboard-test-card";

export default function Dashboard() {
  return (
    <>
      <div className="p-10 space-y-5 ">

        <DashboardKpiCards />

        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-grey">
            <DashboardMainGraph />
          </div>

          <div className="lg:col-span-1 grid grid-rows-2 gap-5">
            <div className="">
              <DashboardTestCard></DashboardTestCard>
            </div>

            <div className="">
              <DashboardTestCard></DashboardTestCard>
            </div>
          </div>

        </div>
        
      </div>
    </>
  );
}
