import { getUserAction } from "../../_actions/adminUserAction";
import UsersTable from "../../_components/UsersTable";

const UserManagementPage = async () => {
  const users = await getUserAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>

        <p className="text-muted-foreground">Manage all RentNest users.</p>
        <p className="text-muted-foreground">Delete API is not build yet </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
};

export default UserManagementPage;
