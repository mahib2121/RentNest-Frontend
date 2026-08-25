import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <Bell className="h-10 w-10 text-primary-foreground/80" />

        <h2 className="mt-4 text-3xl font-bold text-primary-foreground">
          Ready to find your nest?
        </h2>

        <p className="mt-2 max-w-xl text-primary-foreground/80">
          Start exploring properties or list your property on RentNest.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/browse">
              Browse properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/register?role=landlord">List your property</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
