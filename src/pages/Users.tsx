import UserTable from "../components/tables/UserTable";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-4 text-2xl font-semibold">Users</h1>
      <div className="overflow-x-auto">
        <UserTable />
      </div>
    </div>
  );
}