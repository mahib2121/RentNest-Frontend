import { getUserAction } from "../../_actions/adminUserAction";
import UsersTable from "../../_components/UsersTable";
import { AlertCircle } from "lucide-react";

export default async function UserManagementPage() {
  const users = await getUserAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage all RentNest users.</p>
      </div>

      {/* TODO: Remove this warning block once the Delete API is implemented */}
      <div className="flex w-fit items-center gap-2 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800 border border-yellow-200">
        <AlertCircle className="h-4 w-4" />
        <p>The Delete User API is not built yet.</p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
