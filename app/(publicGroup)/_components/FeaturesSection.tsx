import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Smart Property Search",
    description:
      "Filter by price, beds, baths, and amenities to find your perfect nest in minutes.",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description:
      "Pay rent online and track your rental payment history in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Browse properties reviewed by our platform for safer rental decisions.",
  },
  {
    icon: MessageSquare,
    title: "Request & Review",
    description:
      "Submit rental requests and leave reviews after your rental experience.",
  },
];

const roles = [
  {
    icon: Users,
    title: "For Tenants",
    color: "bg-sky-50 text-sky-600",
    points: [
      "Browse verified listings",
      "Submit rental requests",
      "Pay rent online",
      "Leave reviews",
    ],
    href: "/browse",
    button: "Find a Property",
  },
  {
    icon: Building2,
    title: "For Landlords",
    color: "bg-emerald-50 text-emerald-600",
    points: [
      "List properties with photos",
      "Review rental requests",
      "Track payment history",
      "Manage tenants",
    ],
    href: "/register?role=landlord",
    button: "List Your Property",
  },
  {
    icon: ShieldCheck,
    title: "For Admins",
    color: "bg-amber-50 text-amber-600",
    points: [
      "Moderate users and content",
      "Manage accounts",
      "View statistics",
      "Resolve reports",
    ],
    href: "/login",
    button: "Admin Sign In",
  },
];

export default function FeaturesSection() {
  return (
    <>
      {/* Features */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to rent with confidence
            </h2>

            <p className="mt-3 text-muted-foreground">
              From first search to final payment, RentNest covers the rental
              lifecycle.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section
        id="roles"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Built for your role
          </h2>

          <p className="mt-3 text-muted-foreground">
            Choose how you want to use RentNest.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.title}>
              <CardContent className="p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${role.color}`}
                >
                  <role.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-xl font-semibold">{role.title}</h3>

                <ul className="mt-4 space-y-2">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Button className="mt-6 w-full" variant="outline" asChild>
                  <Link href={role.href}>
                    {role.button}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
