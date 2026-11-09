# RentNest Performance: Technical Documentation

This document describes the performance work already present in RentNest and a practical plan for improving it further. It is based on the current frontend implementation; recommendations are proposals and should be validated with production measurements before and after implementation.

## Goals and measurement

Use the Core Web Vitals at the 75th percentile as the user experience targets:

| Metric | Target | What it measures |
| --- | --- | --- |
| Largest Contentful Paint (LCP) | <= 2.5 s | Time until the main page content is visible |
| Interaction to Next Paint (INP) | <= 200 ms | Responsiveness to user interactions |
| Cumulative Layout Shift (CLS) | <= 0.1 | Unexpected movement during page load |

Measure production pages on both mobile and desktop. Use Lighthouse or PageSpeed Insights for repeatable lab checks and Chrome DevTools Performance for diagnosing long tasks, layout, and network bottlenecks. For real-user data, collect web-vitals with route/device context and report p75 over a rolling window. Capture a baseline before changing code, then compare the same routes and conditions after each change. Do not treat a single Lighthouse score as proof of a production improvement.

Recommended routes to track:

- `/` — hero content, market figures, and featured properties.
- `/properties` — card view and `?view=table` with representative filters.
- `/properties/[id]` — property image and booking form.
- `/tenant-dashboard` and `/landlord-dashboard` — authenticated data views.

## Performance work already in the project

### Public property data caching

`app/(publicGroup)/_actions/property.ts` wraps the public property request in React `cache()` and Next.js `"use cache"` with `cacheLife("hours")`. `getAllProperties()` is the shared source for the home page and property listing page, and the home page derives both featured listings and market statistics from the same cached data. This avoids duplicate backend calls and allows public data to be reused across requests. The current listing fetch requests up to 60 properties; it is not yet a paginated, server-filtered search implementation.

The properties page calls `connection()` because view, sort, and filter state comes from the query string and must be read per request. The property data remains cached while the request-specific page shell is rendered dynamically.

### Smaller local font payload

`app/layout.tsx` loads local font files with `next/font/local` and `display: "swap"`. It uses separate static faces for display, body, numeric, and label text plus a small currency glyph subset. A code comment records that the previous full variable font added roughly 360 KB and was associated with a 4.2 s LCP during earlier measurements; the current static faces are approximately 54 KB combined, with the currency subset approximately 1.6 KB. These are historical figures from the code comments, not a current verified production measurement. Local fonts avoid a third-party font request and preserve fallback metric handling.

### Virtualized data tables

`components/ui/virtual-table.tsx` uses `@tanstack/react-virtual` to render the visible rows plus a small overscan window instead of creating DOM nodes for every result. It measures row heights, uses stable row keys, and provides a first-render fallback so the table is not blank before browser measurements are available. The scroll-driven measurement is throttled with `hooks/useRafThrottle.ts` to at most one callback per animation frame. Admin and public table views reuse this component.

### Listing images

`app/(publicGroup)/_components/PropertyCard.tsx` uses `next/image`, responsive `sizes`, and priority loading for only the first few cards. Fixed aspect ratios reserve image space and reduce layout shifts. Remote image optimization currently permits `images.pexels.com` in `next.config.ts`; image URLs from other hosts need deliberate configuration before they can be optimized.

### Server rendering and protected data

Public pages and property cards are primarily server-rendered. Protected requests use server-side actions/services and HTTP-only cookies. User-specific data is fetched without caching in `service/getMe.ts` and related authenticated flows, avoiding the risk of serving one user's session data to another.

## Improvement plan

Prioritize work using measured user impact. Re-measure after each change so improvements and regressions can be attributed.

### 1. Establish field and lab baselines

1. Record LCP, INP, and CLS for the routes above on mobile and desktop.
2. Add real-user web-vitals reporting with privacy-conscious route and device dimensions. Exclude query values and personal data from analytics.
3. Record the deployed commit, test conditions, and p75 results in a small performance log so later comparisons are meaningful.
4. Use DevTools traces and network waterfalls to identify the largest image, slowest API call, render-blocking resource, and longest main-thread task per route.

This step is necessary before setting project-specific budgets: current verified production measurements are not recorded in the repository.

### 2. Improve image delivery

- Confirm which image hosts are used by real property listings. Add only trusted hosts to `images.remotePatterns`, or serve uploads through a controlled image service.
- Ensure listing images have correct dimensions and formats (AVIF/WebP where supported), responsive widths, and cache headers.
- Keep above-the-fold images prioritized and leave below-the-fold images lazy-loaded. Avoid marking every card image as priority.
- Consider a small thumbnail rendition for listing cards and a larger rendition for property detail pages.
- Provide a stable aspect ratio and useful fallback for missing or failed images.

### 3. Scale property search beyond the current limit

The public list currently fetches up to 60 properties and filters/sorts that set in the page. As listing volume grows, move filtering, sorting, and pagination to the backend query, return only the requested page and fields, and include total counts for navigation. Keep query parameters as the source of truth so filters can be shared and restored. Cache public results using a clear revalidation policy; invalidate or refresh cache entries when a landlord changes a listing if the backend supports it.

For very large client-side result sets, avoid transferring every listing merely to filter locally. Continue using the virtualized table for dense tabular views.

### 4. Reduce client JavaScript and hydration work

- Keep data-heavy page sections as Server Components and mark only interactive controls as Client Components.
- Review client component boundaries in filters, dashboards, and shared navigation; avoid pulling large UI modules into routes that do not use them.
- Load infrequent dialogs and charts on demand where this measurably reduces the initial route bundle.
- Use `useDebouncedValue` for text search that triggers costly filtering or network requests; do not debounce simple select controls without a need.
- Profile expensive list transformations. For large lists, do the work on the server or use memoization only when profiling shows repeated work is material.

### 5. Improve API latency and failure behavior

- Measure backend latency separately from frontend rendering. The property action comments note an earlier response time around 1.2 seconds; confirm current latency from production traces.
- Return only fields each page needs and add backend pagination and indexes for frequently filtered fields where applicable.
- Keep public cached data separate from session-specific data. Never cache responses that include private account or rental-request data in a shared cache.
- Add bounded timeouts and clear loading/error states for requests that can delay a page. Consider stale-while-revalidate behavior for public listings if freshness requirements permit.
- Avoid making independent API calls sequentially when they can safely run concurrently.

### 6. Protect layout stability and main-thread responsiveness

- Reserve dimensions for images, dialogs, and asynchronously loaded sections.
- Keep font `display: "swap"` and the current metric-compatible local fallback approach; verify no late font or image causes CLS in field data.
- Keep scroll and resize handlers lightweight and frame-throttled when they update layout-sensitive UI.
- Break up expensive client-side work or move it server-side when traces show long tasks.

### 7. Add performance budgets to delivery

Once a stable baseline exists, define budgets for route JavaScript, image bytes, and Core Web Vitals. Track regressions in pull requests using a repeatable production build and representative routes. Treat budgets as investigation signals, not substitutes for real-user measurements. The repository currently has `pnpm build` and `pnpm lint`; no dedicated performance audit or benchmark command is configured.

## Verification checklist for a performance change

1. State the affected route and suspected bottleneck.
2. Capture the relevant baseline metric or trace.
3. Make one focused change.
4. Re-run the same check under the same conditions.
5. Check correctness, accessibility, and loading/error states alongside performance.
6. Review field data after deployment, since lab results do not represent every device or network.

## Related implementation files

- `app/(publicGroup)/_actions/property.ts` — public listing fetch and cache policy.
- `app/(publicGroup)/properties/page.tsx` — query-driven search page rendering.
- `app/(publicGroup)/_components/PropertyCard.tsx` — optimized listing images and card layout.
- `components/ui/virtual-table.tsx` — virtualized table rendering.
- `hooks/useRafThrottle.ts` — animation-frame throttling.
- `hooks/useDebouncedValue.ts` — debounced value helper.
- `app/layout.tsx` — local font loading.
- `next.config.ts` — Next.js cache and remote image configuration.
