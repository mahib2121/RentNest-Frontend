import { getUserAction } from "../../_actions/adminUserAction";
import UsersTable from "../../_components/UsersTable";
import { AlertCircle } from "lucide-react";

export default async function UserManagementPage() {
  const users = await getUserAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-tight">Users</h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Every account registered on RentNest.
        </p>
      </div>

      {/* TODO: Remove this notice once the Delete User API is implemented */}
      <div className="flex w-fit items-center gap-2 rounded-sm border border-status-pending/40 bg-status-pending/10 px-3 py-2 text-sm text-status-pending">
        <AlertCircle className="h-4 w-4" />
        <p>Deleting a user is not supported by the API yet.</p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
