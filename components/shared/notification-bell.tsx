"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "@/app/(dashboardGroup)/_actions/notifications";

const PUSHER_KEY = process.env.PUSHER_KEY;
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER;

/**
 * Live notifications for the signed-in landlord or tenant.
 *
 * Earlier notifications come from the server render; new ones arrive over
 * the user's private Pusher channel. pusher-js is imported inside the effect
 * so it never lands in the initial bundle.
 */
export function NotificationBell({
  userId,
  initialNotifications,
  href,
}: {
  userId: string;
  initialNotifications: AppNotification[];
  /** Where a notification links to — the user's own dashboard. */
  href: string;
}) {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Optimistic: flip to read immediately, restore if the backend refuses.
  async function handleMarkRead(id: string) {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    const result = await markNotificationRead(id);

    if (!result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      );
      toast.error(result.message);
    }
  }

  async function handleMarkAllRead() {
    const unreadIds = new Set(
      notifications.filter((n) => !n.isRead).map((n) => n.id),
    );
    if (unreadIds.size === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const result = await markAllNotificationsRead();

    if (!result.success) {
      setNotifications((prev) =>
        prev.map((n) => (unreadIds.has(n.id) ? { ...n, isRead: false } : n)),
      );
      toast.error(result.message);
    }
  }

  useEffect(() => {
    if (!PUSHER_KEY || !PUSHER_CLUSTER) {
      console.warn(
        "Pusher is not configured: set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER.",
      );
      return;
    }

    const channelName = `private-user-${userId}`;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return;

      const pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        // Same-origin route handler; it forwards the session cookie to the
        // backend. See app/api/pusher/auth/route.ts.
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
      });

      const channel = pusher.subscribe(channelName);

      channel.bind("new-notification", (n: AppNotification) => {
        setNotifications((prev) =>
          prev.some((p) => p.id === n.id) ? prev : [n, ...prev],
        );
        toast(n.title, { description: n.message });
      });

      cleanup = () => {
        channel.unbind_all();
        pusher.unsubscribe(channelName);
        pusher.disconnect();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [userId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="h-4 w-4" />

          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between gap-2 pr-1">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="rounded-sm px-2 py-1 text-xs text-primary transition-colors hover:bg-secondary"
            >
              Mark all as read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            No notifications yet.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} asChild>
                <Link
                  href={href}
                  onClick={() => handleMarkRead(n.id)}
                  className="flex cursor-pointer flex-col items-start gap-0.5"
                >
                  <span className="flex w-full items-center gap-2 text-sm font-medium">
                    {!n.isRead && (
                      <span
                        aria-label="Unread"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                    )}
                    {n.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {n.message}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
