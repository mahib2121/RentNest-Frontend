"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LayoutDashboard, LogOut, User } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logout } from "@/service/logout";

/**
 * The signed-in account menu.
 *
 * Split out of `navbar.tsx` so the radix dropdown, the avatar image handler
 * and the toast runtime are only downloaded by people who are actually
 * signed in. The signed-out navbar is a plain server component.
 */
export function AccountMenu({
  name,
  email,
  role,
  photo,
  dashboardHref,
}: {
  name: string;
  email: string;
  role: string;
  photo: string | null;
  dashboardHref: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Try again.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-sm"
          aria-label="Account menu"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm bg-secondary">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </span>

          <span className="hidden text-sm sm:inline">{name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{name}</p>

            <p className="truncate text-xs text-muted-foreground">{email}</p>

            <p className="mt-1 text-xs capitalize text-accent-ink">
              {role.toLowerCase()}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/tenant-dashboard/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
