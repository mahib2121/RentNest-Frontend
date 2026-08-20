"use client";

import {
  Building,
  Home,
  Users,
  UserRound,
  ClipboardList,
  CreditCard,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/60 shadow-sm">
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>

              <Skeleton className="h-10 w-10 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      hint: "All registered accounts",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-100",
    },
    {
      label: "Tenants",
      value: stats.totalTenants,
      icon: UserRound,
      hint: "Renting on the platform",
      iconClass: "text-violet-600",
      bgClass: "bg-violet-100",
    },
    {
      label: "Landlords",
      value: stats.totalLandlords,
      icon: Building,
      hint: "Listing properties",
      iconClass: "text-amber-600",
      bgClass: "bg-amber-100",
    },
    {
      label: "Properties",
      value: stats.totalProperties,
      icon: Home,
      hint: "Active listings",
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-100",
    },
    {
      label: "Rental Requests",
      value: stats.totalRentalRequests,
      icon: ClipboardList,
      hint: "Submitted by tenants",
      iconClass: "text-rose-600",
      bgClass: "bg-rose-100",
    },
    {
      label: "Payments",
      value: stats.totalPayments,
      icon: CreditCard,
      hint: "Processed transactions",
      iconClass: "text-indigo-600",
      bgClass: "bg-indigo-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

        <p className="text-muted-foreground">
          Overview of your RentNest platform.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.label}
              className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>

                  <p className="text-3xl font-bold tracking-tight">
                    {card.value.toLocaleString()}
                  </p>

                  <p className="text-xs text-muted-foreground">{card.hint}</p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.bgClass}`}
                >
                  <Icon className={`h-5 w-5 ${card.iconClass}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
