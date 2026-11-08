"use client";

import { Skeleton } from "@/components/ui/skeleton";

type DashboardStats = {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  totalRentalRequests: number;
  totalPayments: number;
};

type AdminDashboardProps = {
  stats?: DashboardStats;
  isLoading?: boolean;
};

export default function AdminDashboard({
  stats,
  isLoading = false,
}: AdminDashboardProps) {
  if (isLoading || !stats) {
    return (
      <div className="space-y-0 border-y border-line">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-line px-1 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const rows = [
    { label: "Registered users", value: stats.totalUsers },
    { label: "Tenants", value: stats.totalTenants },
    { label: "Landlords", value: stats.totalLandlords },
    { label: "Listed properties", value: stats.totalProperties },
    { label: "Rental requests", value: stats.totalRentalRequests },
    { label: "Payments recorded", value: stats.totalPayments },
  ];

  return (
    <div className="space-y-8">
      {/* Ledger — label left, figure right, hairline between rows */}
      <div className="border-y border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-b-0"
          >
            <span className="font-label text-sm text-muted-foreground">
              {row.label}
            </span>

            <span className="font-numeric text-2xl text-foreground">
              {row.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
