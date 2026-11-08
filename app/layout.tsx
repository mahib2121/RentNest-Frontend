import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { Toaster } from "@/components/shared/toaster";
import "./globals.css";

/**
 * Google Sans Flex, instanced into the four static weights the design system
 * actually uses.
 *
 * The full variable font is 360 KB and sits on the critical path for every
 * page — it was the single largest contributor to a 4.2 s LCP. Each static
 * instance below is 13–14 KB, so the whole family is 54 KB and the browser
 * only fetches the faces it renders.
 *
 * `next/font/google` cannot be used here: Google Sans Flex is missing from
 * Next's `capsize-font-metrics.json`, so it warns "Failed to find font
 * override values" and skips the fallback metrics. `next/font/local` measures
 * the file itself instead.
 */
/**
 * The display face.
 *
 * `display: "swap"`. The face loads in about 40 ms and the heading paints
 * once at 124 ms, so the swap never causes a visible reflow — and unlike
 * `"optional"` it cannot leave the heading in Arial on a slow connection.
 */
const display = localFont({
  src: "./fonts/GoogleSansFlex-Display.woff2",
  variable: "--font-gsf-display",
  display: "swap",
  weight: "650",
  style: "normal",
  fallback: ["Arial"],
});

const body = localFont({
  src: "./fonts/GoogleSansFlex-Body.woff2",
  variable: "--font-gsf-body",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Arial"],
});

const numeric = localFont({
  src: "./fonts/GoogleSansFlex-Numeric.woff2",
  variable: "--font-gsf-numeric",
  display: "swap",
  weight: "600",
  style: "normal",
  fallback: ["Arial"],
});

const label = localFont({
  src: "./fonts/GoogleSansFlex-Label.woff2",
  variable: "--font-gsf-label",
  display: "swap",
  weight: "500",
  style: "normal",
  fallback: ["Arial"],
});

/**
 * The taka sign (৳) is not part of Google Sans Flex — every price on the
 * site was rendering in a system font. This 1.6 KB subset carries only the
 * currency glyphs.
 */
const currency = localFont({
  src: "./fonts/NotoSansBengali-currency.woff2",
  variable: "--font-gsf-currency",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Arial"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        display.variable,
        body.variable,
        numeric.variable,
        label.variable,
        currency.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
