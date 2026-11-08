"use client";

import {
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Star,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarLink from "./sidebarLink";

type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

type DashboardSidebarProps = {
  role: UserRole;
};

type NavItem = {
  href: string;
  icon: typeof Home;
  label: string;
};

const tenantLinks: NavItem[] = [
  { href: "/tenant-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/properties", icon: Home, label: "Browse properties" },
  { href: "/tenant-dashboard/my-posts", icon: FileText, label: "My posts" },
  { href: "/payment", icon: CreditCard, label: "Payments" },
];

const landlordLinks: NavItem[] = [
  { href: "/landlord-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/landlord-dashboard/my-properties",
    icon: Building2,
    label: "My properties",
  },
  {
    href: "/landlord-dashboard/rental-request",
    icon: ClipboardList,
    label: "Rental requests",
  },
  { href: "/payment", icon: CreditCard, label: "Payments" },
];

const adminLinks: NavItem[] = [
  { href: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin-dashboard/users", icon: Users, label: "Users" },
  {
    href: "/admin-dashboard/properties",
    icon: Building2,
    label: "Properties",
  },
  {
    href: "/admin-dashboard/rental-requests",
    icon: ClipboardList,
    label: "Rental requests",
  },
];

const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const pathname = usePathname();

  const links =
    role === "TENANT"
      ? tenantLinks
      : role === "LANDLORD"
        ? landlordLinks
        : adminLinks;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-sidebar md:block">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col">
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-3 font-label text-xs text-muted-foreground">
            {role === "TENANT"
              ? "Tenant"
              : role === "LANDLORD"
                ? "Landlord"
                : "Administration"}
          </p>

          <div className="space-y-0.5">
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                }
              />
            ))}
          </div>
        </nav>

        <div className="border-t border-line p-3">
          <SidebarLink
            href="/tenant-dashboard/profile"
            icon={Star}
            label="Profile"
            active={pathname.startsWith("/tenant-dashboard/profile")}
          />
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
