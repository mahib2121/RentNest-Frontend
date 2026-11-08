import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper-raised">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg tracking-tight"
            >
              <Home className="h-4 w-4 text-primary" />

              <span>RentNest</span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A rental platform for Dhaka. Browse listings, apply, and pay
              from one place.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-label text-sm">Platform</h3>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/properties"
                  className="hover:text-foreground"
                >
                  Browse properties
                </Link>
              </li>

              <li>
                <Link
                  href="/register?role=landlord"
                  className="hover:text-foreground"
                >
                  List a property
                </Link>
              </li>

              <li>
                <Link href="/login" className="hover:text-foreground">
                  Sign in
                </Link>
              </li>

              <li>
                <Link href="/register" className="hover:text-foreground">
                  Create account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-label text-sm">Support</h3>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Help center
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact us
                </Link>
              </li>

              <li>
                <Link href="/report" className="hover:text-foreground">
                  Report a problem
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-label text-sm">Legal</h3>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of service
                </Link>
              </li>

              <li>
                <Link
                  href="/rental-policy"
                  className="hover:text-foreground"
                >
                  Rental policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-5">
          <p className="font-numeric text-xs text-muted-foreground">
            © 2026 RentNest
          </p>
        </div>
      </div>
    </footer>
  );
}
