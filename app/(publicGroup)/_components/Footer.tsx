import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </div>

              <span className="text-xl font-bold">RentNest</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              A simple and trusted platform for finding and managing rental
              properties.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold">Platform</h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/browse" className="hover:text-foreground">
                  Browse Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/register?role=landlord"
                  className="hover:text-foreground"
                >
                  List a Property
                </Link>
              </li>

              <li>
                <Link href="/login" className="hover:text-foreground">
                  Sign In
                </Link>
              </li>

              <li>
                <Link href="/register" className="hover:text-foreground">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold">Support</h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Help Center
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/report" className="hover:text-foreground">
                  Report a Problem
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold">Legal</h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link href="/rental-policy" className="hover:text-foreground">
                  Rental Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 RentNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
