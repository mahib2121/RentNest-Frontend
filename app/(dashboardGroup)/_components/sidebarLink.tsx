"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type SidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
};

const SidebarLink = ({ href, icon: Icon, label, active }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
};

export default SidebarLink;
