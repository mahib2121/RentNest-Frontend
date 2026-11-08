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
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors duration-150 ease-out ${
        active
          ? "marker-active bg-secondary font-medium text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
};

export default SidebarLink;
