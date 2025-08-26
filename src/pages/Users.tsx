import UserTable from "../components/tables/UserTable";

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <UserTable />
    </div>
  );
}