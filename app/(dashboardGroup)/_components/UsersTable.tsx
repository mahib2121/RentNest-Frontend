"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";

import { VirtualTable } from "@/components/ui/virtual-table";
import {
  deleteUserAction,
  updateUserStatusAction,
} from "../_actions/adminUserAction";
import { StatusChip } from "./StatusChip";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type User = {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BANNED";
};

/**
 * The admin user table.
 *
 * Two things were slow here. The table rendered every user, so a large
 * directory meant a large DOM; and every row re-rendered whenever any row's
 * action started, because the pending id lived in the same state as the
 * list.
 *
 * The body is virtualised so only the visible rows exist in the DOM, and
 * each row is memoised on its own identity — changing one user's status
 * re-renders that row and nothing else.
 */
export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  /**
   * The search box updates on every keystroke, but the list does not need to.
   * Debouncing the query keeps typing responsive and filters the list once
   * the user pauses.
   */
  const debouncedQuery = useDebouncedValue(query, 250);

  /**
   * `useDeferredValue` lets React keep the input responsive while the
   * (more expensive) filtered list is recomputed in the background.
   */
  const deferredQuery = useDeferredValue(debouncedQuery);

  const visibleUsers = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();

    if (!needle) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.role.toLowerCase().includes(needle),
    );
  }, [users, deferredQuery]);

  const handleStatusChange = useCallback(
    async (id: string, status: "ACTIVE" | "BANNED") => {
      try {
        setPendingId(id);

        const updatedUser = await updateUserStatusAction(id, status);

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === id ? { ...user, status: updatedUser.status } : user,
          ),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setPendingId(null);
      }
    },
    [],
  );

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      setPendingId(id);

      await deleteUserAction(id);

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setPendingId(null);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        renderCell: (user: User) => <span className="font-medium">{user.name}</span>,
      },
      {
        key: "email",
        label: "Email",
        renderCell: (user: User) => (
          <span className="text-muted-foreground">{user.email}</span>
        ),
      },
      {
        key: "role",
        label: "Role",
        width: "110px",
        renderCell: (user: User) => (
          <span className="font-label text-xs">
            {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        width: "110px",
        renderCell: (user: User) => <StatusChip status={user.status} />,
      },
      {
        key: "actions",
        label: "Actions",
        width: "170px",
        align: "right" as const,
        renderCell: (user: User) => (
          <div className="flex justify-end gap-2">
            <button
              disabled={pendingId === user.id}
              onClick={() =>
                handleStatusChange(
                  user.id,
                  user.status === "ACTIVE" ? "BANNED" : "ACTIVE",
                )
              }
              className="rounded-sm border border-line-strong px-2.5 py-1 text-xs transition-colors duration-150 ease-out hover:border-foreground/40 hover:bg-secondary disabled:opacity-50"
            >
              {user.status === "ACTIVE" ? "Ban" : "Activate"}
            </button>

            <button
              disabled={pendingId === user.id}
              onClick={() => handleDelete(user.id)}
              className="rounded-sm border border-destructive/40 px-2.5 py-1 text-xs text-destructive transition-colors duration-150 ease-out hover:bg-destructive/10 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [pendingId, handleStatusChange, handleDelete],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="user-search" className="sr-only">
          Search users
        </label>

        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email or role"
          className="h-9 w-full max-w-xs rounded-sm border border-line-strong bg-transparent px-3 text-sm outline-none transition-colors duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />

        <p className="font-numeric text-sm text-muted-foreground">
          {visibleUsers.length}{" "}
          {visibleUsers.length === 1 ? "user" : "users"}
        </p>
      </div>

      <VirtualTable
        columns={columns}
        rows={visibleUsers}
        rowKey={(user) => user.id}
        height={560}
        overscan={8}
        empty={
          <div className="rounded-sm border border-line px-6 py-12 text-center text-sm text-muted-foreground">
            {query.trim()
              ? "No users match that search."
              : "No users found."}
          </div>
        }
      />
    </div>
  );
}
