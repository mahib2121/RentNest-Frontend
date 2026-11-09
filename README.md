# RentNest

RentNest is a rental property marketplace for discovering homes, sending rental requests, and managing listings. The frontend includes public property search and detail pages, account registration and login, and role-based dashboards for tenants, landlords, and administrators.

## Live site

[Open RentNest](https://rent-nest-frontend-z5w1.vercel.app/)

## Features

- Browse property listings and view property details, rent, location, and landlord information.
- Filter listings by city, category, bedroom count, and maximum rent; switch between card and table views and sort results.
- Register and sign in as a tenant, landlord, or administrator.
- Submit rental requests and track their status from the tenant dashboard.
- Review and approve or reject rental requests from the landlord dashboard.
- Manage landlord properties, including creating, editing, and deleting listings.
- Start Stripe Checkout for approved rental requests and track payment and booking status.
- View platform activity and manage users, properties, and rental requests through admin pages.
- Use responsive layouts and localized Bangladeshi Taka pricing.

## Main routes

| Route | Description |
| --- | --- |
| `/` | RentNest landing page |
| `/properties` | Property listings, filters, sort, and view options |
| `/properties/[id]` | Property details and rental request form |
| `/login` | Sign in |
| `/register` | Create an account |
| `/tenant-dashboard` | Tenant rental requests and payment actions |
| `/tenant-dashboard/profile` | Tenant profile |
| `/tenant-dashboard/my-posts` | Tenant posts |
| `/landlord-dashboard` | Landlord rental requests |
| `/landlord-dashboard/my-properties` | Manage landlord listings |
| `/landlord-dashboard/rental-request` | Landlord rental request management |
| `/admin-dashboard` | Admin overview |
| `/admin-dashboard/users` | User management |
| `/admin-dashboard/properties` | Property management |
| `/admin-dashboard/rental-requests` | Rental request management |
| `/payment` | Payment return/status page |

Dashboard routes are protected by authentication and role checks. The backend remains responsible for enforcing authorization.

## Tech stack

- Next.js 16 App Router with React 19 and TypeScript
- Tailwind CSS 4
- Axios for server-side API requests
- Zod for form validation
- Radix UI primitives, Lucide icons, and Sonner notifications
- TanStack Virtual for virtualized tables
- Vercel for the live frontend deployment

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version
- pnpm
- Access to the RentNest backend API

### Install and run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root. The frontend expects the backend API base URL and JWT verification secrets on the server:

```dotenv
APIurl=https://b7-a4-rent-nest-backend.vercel.app
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
NEXT_PUBLIC_BACKEND_API_URL=https://b7-a4-rent-nest-backend.vercel.app
```

Use the matching values for your backend deployment. Keep secrets private; do not commit real credentials. `APIurl` is used by server-side authentication and proxy requests, the JWT secrets are used to verify session tokens, and the public variable is available to client-side code if needed.

## Available scripts

```bash
pnpm dev      # Start the development server
pnpm build    # Create a production build
pnpm start    # Serve the production build
pnpm lint     # Run ESLint
```

## Application structure

```text
app/
  (publicGroup)/       Public landing page, properties, and payment pages
  (authGroup)/         Login and registration
  (dashboardGroup)/    Tenant, landlord, and admin dashboards
components/            Shared navigation, notifications, and UI components
hooks/                 Reusable client hooks
lib/                   API clients, dashboard helpers, and utilities
service/               Authentication and user services
utils/                 Token utilities
public/                Static assets
```

Route groups in parentheses organize layouts and related pages without adding those group names to the URL.

## API and payment integration

The frontend connects to the RentNest backend at `https://b7-a4-rent-nest-backend.vercel.app` by default. Authenticated requests use HTTP-only access and refresh cookies. The backend supports property/category data, user authentication, rental requests, and Stripe checkout. Review [API_INTEGRATION.md](./API_INTEGRATION.md) for endpoint paths, request/response shapes, role requirements, and the booking-to-payment flow.

## Deployment

The production frontend is hosted on Vercel at [rent-nest-frontend-z5w1.vercel.app](https://rent-nest-frontend-z5w1.vercel.app/). Configure the environment variables above in the deployment environment, pointing them at the intended backend and using the matching JWT secrets.
