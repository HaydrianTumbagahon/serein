# Serein

Serein is a front-end prototype for a considered hotel booking experience. It
lets visitors explore a curated set of mock stays, search and filter properties,
save favorites, and follow a simulated booking flow through confirmation and a
local demo account.

> **Prototype notice:** Serein is for demonstration and portfolio use. It has no
> booking, payment, or authentication backend. Listings and reviews are sample
> data, bookings are simulated, and account preferences are stored in the
> current browser. Do not enter real payment details or reuse a real password.

## Highlights

- Responsive hotel discovery, destination search, date and guest selection, and
  shareable search filters.
- Hotel detail pages with galleries, room selection, amenities, and reviews.
- Simulated checkout, booking confirmation, wishlist, and account screens.
- Light and dark design tokens, accessible controls, reduced-motion support,
  and responsive layouts.
- Unsplash-hosted sample imagery; no map or payment API key is required.

## Technology

- **Framework:** Next.js App Router, React, and TypeScript.
- **Styling:** Tailwind CSS v4 with a custom Serein design system.
- **Navigation:** React Router is retained for the client-side prototype
  experience mounted within the Next.js shell.
- **UI and motion:** Radix UI, Lucide, Framer Motion, GSAP, Embla Carousel,
  Lenis, and React Intersection Observer.
- **Forms and validation:** React Hook Form and Zod.
- **State:** Zustand with browser-local persistence for demo preferences,
  wishlists, bookings, and accounts.
- **Utilities:** date-fns, Sonner, clsx, and tailwind-merge.

## How it is put together

The interface is composed from reusable layout, shared, hotel, and home
components. Mock destinations, properties, rooms, amenities, and reviews live
in the data layer; search and booking calculations are handled by frontend
helpers. Zustand stores keep the interactive prototype self-contained in the
browser, while React Hook Form and Zod provide client-side form validation.

Next.js provides the application shell, build pipeline, image handling, and
metadata. The existing screens still run as a client-side React Router
experience; this prototype does not provide server-backed booking or account
services.

## Getting started

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Available scripts

```sh
npm run dev    # Start the local development server
npm run build  # Create a production build
npm start      # Serve the production build
npm run lint   # Run Oxlint
```

## Environment variables and security

No environment variables or API credentials are required for the current
prototype. Private environment files (`.env*`) are ignored by Git; sanitized
examples named `.env.example` or `.env.*.example` may be committed. Never put a
secret in a `NEXT_PUBLIC_` variable or client-side source, because public
variables are included in browser bundles. If a credential is ever exposed,
revoke or rotate it with its provider before removing it from the codebase.

The local demo account is not production authentication, and the checkout does
not process payments. A production service would need server-side validation,
secure authentication, protected secret storage, and a payment provider
integration.

## Contributing

Install dependencies, run the development server, and verify changes with
`npm run build` and `npm run lint`. Keep secrets out of commits and use only
synthetic data when extending the prototype.
