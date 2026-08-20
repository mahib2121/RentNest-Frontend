"use client";

import {
  LayoutDashboard,
  Home,
  Users,
  ClipboardList,
  CreditCard,
  PlusCircle,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLink from "./sidebarLink";

type Role = "TENANT" | "LANDLORD" | "ADMIN";

type DashboardSidebarProps = {
  role?: Role;
};

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden w-72 border-r bg-background lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Home className="h-6 w-6" />
          <span>RentNest</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* General */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>

          <div className="space-y-1">
            <SidebarLink
              href="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              active={isActive("/dashboard")}
            />

            <SidebarLink
              href="/properties"
              icon={Home}
              label="Properties"
              active={isActive("/properties")}
            />
          </div>
        </div>

        {/* Tenant */}
        {role === "TENANT" && (
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tenant
            </p>

            <div className="space-y-1">
              <SidebarLink
                href="/rental-requests"
                icon={ClipboardList}
                label="My Rental Requests"
                active={isActive("/rental-requests")}
              />

              <SidebarLink
                href="/payments"
                icon={CreditCard}
                label="Payment History"
                active={isActive("/payments")}
              />
            </div>
          </div>
        )}

        {/* Landlord */}
        {role === "LANDLORD" && (
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Landlord
            </p>

            <div className="space-y-1">
              <SidebarLink
                href="/landlord/properties"
                icon={Home}
                label="My Properties"
                active={isActive("/landlord/properties")}
              />

              <SidebarLink
                href="/landlord/rental-requests"
                icon={ClipboardList}
                label="Rental Requests"
                active={isActive("/landlord/rental-requests")}
              />

              <SidebarLink
                href="/landlord/add-property"
                icon={PlusCircle}
                label="Add Property"
                active={isActive("/landlord/add-property")}
              />
            </div>
          </div>
        )}

        {/* Admin */}
        {role === "ADMIN" && (
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Administration
            </p>

            <div className="space-y-1">
              <SidebarLink
                href="/admin-dashboard"
                icon={LayoutDashboard}
                label="Admin Dashboard"
                active={isActive("/admin-dashboard")}
              />

              <SidebarLink
                href="/admin-dashboard/users"
                icon={Users}
                label="Users"
                active={isActive("/admin-dashboard/users")}
              />

              <SidebarLink
                href="/admin-dashboard/properties"
                icon={Home}
                label="Properties"
                active={isActive("/admin-dashboard/properties")}
              />

              <SidebarLink
                href="/admin-dashboard/rentals"
                icon={ClipboardList}
                label="Rental Requests"
                active={isActive("/admin-dashboard/rentals")}
              />

              <SidebarLink
                href="/admin-dashboard/payments"
                icon={CreditCard}
                label="Payments"
                active={isActive("/admin-dashboard/payments")}
              />
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
