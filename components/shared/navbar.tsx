import Link from "next/link";

import { Button } from "../ui/button";
import { AccountMenuLazy } from "./account-menu-lazy";

export type NavUser = {
  success: boolean;
  message: string;
  data?: {
    profile?: {
      id: string;
      name: string;
      email: string;
      activeStatus: string;
      role: string;
      profile?: {
        id: string;
        profilePhoto: string;
        bio: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
};

const navItems = [
  {
    label: "Properties",
    href: "/properties",
  },
  {
    label: "How it works",
    href: "/#how-it-works",
  },
];

/**
 * The navbar is a server component.
 *
 * The account dropdown is the only part that needs the browser, so it is
 * split into its own client module. A signed-out visitor — the marketing
 * traffic — never downloads the radix dropdown, the Slot primitive, or the
 * toast runtime, because those only arrive with the signed-in branch.
 */
export function Navbar({ user }: { user: NavUser }) {
  const currentUser = user.data?.profile;

  const isSignedIn = Boolean(user.success && currentUser);

  const dashboardHref =
    currentUser?.role === "ADMIN"
      ? "/admin-dashboard"
      : currentUser?.role === "TENANT"
        ? "/tenant-dashboard"
        : "/landlord-dashboard";

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg tracking-tight"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 fill-primary"
            >
              <path d="M8 1.2 1.4 6.6a1 1 0 0 0 .65 1.76H3v5.14A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5V8.36h.95a1 1 0 0 0 .65-1.76L8 1.2Z" />
            </svg>

            <span>
              Rent<span className="text-primary">Nest</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          {isSignedIn && currentUser ? (
            <AccountMenuLazy
              name={currentUser.name}
              email={currentUser.email}
              role={currentUser.role}
              photo={currentUser.profile?.profilePhoto ?? null}
              dashboardHref={dashboardHref}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>

              <Button asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
