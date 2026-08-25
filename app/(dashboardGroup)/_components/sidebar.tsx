"use client";

import {
  Building2,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarLink from "./sidebarLink";

type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

type DashboardSidebarProps = {
  role: UserRole;
};

const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const pathname = usePathname();

  // const commonLinks = [
  //   {
  //     href: "/dashboard",
  //     icon: LayoutDashboard,
  //     label: "Dashboard",
  //   },
  //   {
  //     href: "/dashboard/profile",
  //     icon: Settings,
  //     label: "Profile",
  //   },
  // ];

  const tenantLinks = [
    {
      href: "/dashboard/properties",
      icon: Home,
      label: "Properties",
    },
    {
      href: "/dashboard/rental-requests",
      icon: FileText,
      label: "Rental Requests",
    },
    {
      href: "/dashboard/payments",
      icon: CreditCard,
      label: "Payments",
    },
    {
      href: "/dashboard/reviews",
      icon: Star,
      label: "Reviews",
    },
  ];

  const landlordLinks = [
    {
      href: "/landlord-dashboard/my-properties",
      icon: Building2,
      label: "My Properties",
    },
    {
      href: "/landlord-dashboard/rental-request",
      icon: FileText,
      label: "Rental Requests",
    },
    {
      href: "/dashboard/payments",
      icon: CreditCard,
      label: "Payments",
    },
    {
      href: "/dashboard/reviews",
      icon: Star,
      label: "Reviews",
    },
  ];

  const adminLinks = [
    {
      href: "/admin-dashboard/users",
      icon: Users,
      label: "Users",
    },
    {
      href: "/admin-dashboard/properties",
      icon: Building2,
      label: "Properties",
    },
    {
      href: "/admin-dashboard/rental-requests",
      icon: FileText,
      label: "Rental Requests",
    },
  ];

  const getRoleLinks = () => {
    switch (role) {
      case "TENANT":
        return tenantLinks;

      case "LANDLORD":
        return landlordLinks;

      case "ADMIN":
        return adminLinks;

      default:
        return [];
    }
  };
  //...commonLinks,
  const links = [...getRoleLinks()];

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col">
        <div className="flex-1 space-y-1 p-4">
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

        <div className="border-t p-4">
          <SidebarLink
            href="/dashboard/messages"
            icon={MessageSquare}
            label="Messages"
            active={pathname.startsWith("/dashboard/messages")}
          />
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
