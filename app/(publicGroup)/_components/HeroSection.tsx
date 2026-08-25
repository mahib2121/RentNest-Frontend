import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge
              variant="secondary"
              className="mb-4 rounded-full px-3 py-1 text-sm"
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Trusted rental platform
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find your next <span className="text-primary">nest</span>
              <br />
              without the hassle.
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              RentNest connects tenants and landlords on one platform. Search,
              request, pay, and manage your rental experience in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/browse">
                  Browse properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/register?role=landlord">List your property</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border">
              <Image
                src="https://images.pexels.com/photos/4971275/pexels-photo-4971275.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Happy couple receiving keys to their new home"
                width={1200}
                height={800}
                priority
                className="h-[400px] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-xl border bg-white p-4 shadow-lg lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    Verified properties
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Safer rental decisions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
