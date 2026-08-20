"use client";

import { useState } from "react";
import {
  deleteUserAction,
  updateUserStatusAction,
} from "../_actions/adminUserAction";

type User = {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BANNED";
};

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    status: "ACTIVE" | "BANNED",
  ) => {
    try {
      setLoadingId(id);

      const updatedUser = await updateUserStatusAction(id, status);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, status: updatedUser.status } : user,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      setLoadingId(id);

      await deleteUserAction(id);

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{user.name}</td>

              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>

              <td className="px-4 py-3">{user.role}</td>

              <td className="px-4 py-3">{user.status}</td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    disabled={loadingId === user.id}
                    onClick={() =>
                      handleStatusChange(
                        user.id,
                        user.status === "ACTIVE" ? "BANNED" : "ACTIVE",
                      )
                    }
                    className="rounded-md border px-3 py-1.5 text-xs"
                  >
                    {user.status === "ACTIVE" ? "Ban" : "Activate"}
                  </button>

                  <button
                    disabled={loadingId === user.id}
                    onClick={() => handleDelete(user.id)}
                    className="rounded-md bg-destructive px-3 py-1.5 text-xs text-destructive-foreground"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
