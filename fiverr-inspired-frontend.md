
 Context

 Pakistan on-demand services marketplace (like Fiverr + TaskRabbit). Users can be a Customer (book services) or a Service Provider (offer services) — switchable via role toggle like Fiverr's "Switch to
 Selling". Backend is complete. This plan covers the entire Next.js frontend from scratch, following the existing project structure at apps/web/src.

 UI Inspiration:
 - Fiverr: Hero with search, "Become a Seller" nav CTA, category pills, dark/light contrast
 - TaskRabbit: Minimal/clean, icon-based category row, teal/green accent, "Become a Tasker" button

 ---
 1. Design System

 Color Palette (update src/app/globals.css)

 /* Primary: Teal-green (trust, Pakistan feel) */
 --primary: oklch(0.55 0.15 165);         /* #0a9e7a */
 --primary-foreground: oklch(1 0 0);

 /* Neutrals */
 --background: oklch(0.99 0 0);           /* near white */
 --foreground: oklch(0.13 0 0);           /* near black */
 --muted: oklch(0.95 0 0);
 --muted-foreground: oklch(0.45 0 0);
 --border: oklch(0.9 0 0);
 --card: oklch(1 0 0);

 /* Status */
 --destructive: oklch(0.55 0.22 27);      /* red */
 --success: oklch(0.55 0.15 145);         /* green */
 --warning: oklch(0.75 0.15 80);          /* amber */

 Typography

 - Font: Geist (already in Next.js) or Inter via next/font/google
 - Headings: font-bold tracking-tight
 - Body: text-sm or text-base, text-muted-foreground for secondary

 Spacing & Radius

 - Cards: rounded-xl, shadow-sm
 - Buttons: rounded-lg
 - Inputs: rounded-md
 - Page max-width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

 ---
 2. Complete Folder Structure

 src/
 ├── app/
 │   ├── layout.tsx                        # Root layout (font, providers)
 │   ├── page.tsx                          # Landing page (/)
 │   ├── globals.css                       # Design system tokens
 │   │
 │   ├── auth/                             # Already exists
 │   │   ├── sign-in/page.tsx
 │   │   ├── sign-up/page.tsx
 │   │   ├── forgot-password/page.tsx
 │   │   ├── reset-password/page.tsx
 │   │   ├── verify-email/page.tsx
 │   │   └── otp/page.tsx
 │   │
 │   ├── (public)/                         # Route group - public browsing
 │   │   ├── layout.tsx                    # Public layout (Navbar + Footer)
 │   │   ├── services/page.tsx             # /services - Browse categories
 │   │   ├── providers/page.tsx            # /providers - Browse providers
 │   │   └── providers/[id]/page.tsx       # /providers/:id - Provider profile
 │   │
 │   ├── (customer)/                       # Route group - customer area
 │   │   ├── layout.tsx                    # Customer layout (sidebar + navbar)
 │   │   ├── dashboard/page.tsx            # /dashboard
 │   │   ├── bookings/
 │   │   │   ├── page.tsx                  # /bookings - list
 │   │   │   └── [id]/
 │   │   │       ├── page.tsx              # /bookings/:id - detail
 │   │   │       └── payment/page.tsx      # /bookings/:id/payment
 │   │   ├── profile/
 │   │   │   ├── page.tsx                  # /profile
 │   │   │   └── addresses/page.tsx        # /profile/addresses
 │   │   ├── messages/
 │   │   │   ├── page.tsx                  # /messages - conversation list
 │   │   │   └── [id]/page.tsx             # /messages/:id - chat thread
 │   │   └── notifications/page.tsx        # /notifications
 │   │
 │   ├── (provider)/                       # Route group - provider area
 │   │   ├── layout.tsx                    # Provider layout (sidebar)
 │   │   ├── provider/
 │   │   │   ├── dashboard/page.tsx        # /provider/dashboard
 │   │   │   ├── bookings/
 │   │   │   │   ├── page.tsx              # /provider/bookings
 │   │   │   │   └── [id]/page.tsx         # /provider/bookings/:id
 │   │   │   ├── profile/page.tsx          # /provider/profile
 │   │   │   ├── documents/page.tsx        # /provider/documents - CNIC upload
 │   │   │   ├── portfolio/page.tsx        # /provider/portfolio
 │   │   │   ├── messages/
 │   │   │   │   ├── page.tsx
 │   │   │   │   └── [id]/page.tsx
 │   │   │   └── notifications/page.tsx
 │   │
 │   └── admin/                            # Admin panel
 │       ├── layout.tsx                    # Admin layout (sidebar)
 │       ├── page.tsx                      # /admin - KPI dashboard
 │       ├── providers/
 │       │   ├── page.tsx                  # /admin/providers
 │       │   └── [id]/page.tsx             # /admin/providers/:id - verify
 │       ├── customers/page.tsx            # /admin/customers
 │       ├── bookings/page.tsx             # /admin/bookings
 │       ├── payments/page.tsx             # /admin/payments
 │       ├── payouts/page.tsx              # /admin/payouts
 │       ├── fraud/page.tsx                # /admin/fraud-flags
 │       ├── categories/page.tsx           # /admin/categories
 │       └── commission/page.tsx           # /admin/commission
 │
 ├── components/
 │   ├── ui/                               # shadcn primitives (already exists)
 │   │   ├── button.tsx
 │   │   ├── input.tsx
 │   │   ├── checkbox.tsx
 │   │   ├── badge.tsx                     # ADD: status badges
 │   │   ├── avatar.tsx                    # ADD: user avatars
 │   │   ├── card.tsx                      # ADD: card container
 │   │   ├── dialog.tsx                    # ADD: modals
 │   │   ├── dropdown-menu.tsx             # ADD: menus
 │   │   ├── select.tsx                    # ADD: selects
 │   │   ├── textarea.tsx                  # ADD: text areas
 │   │   ├── skeleton.tsx                  # ADD: loading skeletons
 │   │   ├── tabs.tsx                      # ADD: tab navigation
 │   │   ├── toast.tsx                     # ADD: notifications
 │   │   └── table.tsx                     # ADD: data tables (admin)
 │   │
 │   ├── layout/
 │   │   ├── navbar.tsx                    # Top nav (logo, role toggle, user menu)
 │   │   ├── footer.tsx                    # Public footer
 │   │   ├── sidebar-customer.tsx          # Customer left sidebar
 │   │   ├── sidebar-provider.tsx          # Provider left sidebar
 │   │   └── sidebar-admin.tsx             # Admin left sidebar
 │   │
 │   ├── shared/
 │   │   ├── role-toggle.tsx               # "Switch to Provider/Customer" button
 │   │   ├── notification-bell.tsx         # Bell icon + unread count + dropdown
 │   │   ├── user-avatar-menu.tsx          # Avatar + dropdown (profile, logout)
 │   │   ├── status-badge.tsx              # Booking/payment status pill
 │   │   ├── empty-state.tsx               # Empty list illustration + CTA
 │   │   ├── loading-spinner.tsx           # Centered spinner
 │   │   └── page-header.tsx               # Page title + breadcrumb
 │   │
 │   ├── cards/
 │   │   ├── provider-card.tsx             # Provider listing card (photo, rating, category)
 │   │   ├── booking-card.tsx              # Booking summary card
 │   │   ├── service-category-card.tsx     # Category icon card (like TaskRabbit)
 │   │   └── stat-card.tsx                 # Admin KPI card (number + label + icon)
 │   │
 │   └── forms/
 │       ├── booking-form.tsx              # Create booking (address, date, description)
 │       ├── payment-form.tsx              # Submit payment + upload proof photo
 │       ├── review-form.tsx               # Star rating + comment
 │       ├── address-form.tsx              # Add/edit saved address
 │       └── profile-form.tsx              # Edit user profile
 │
 └── lib/
     ├── auth-client.ts                    # Already exists
     ├── utils.ts                          # Already exists (cn())
     ├── types.ts                          # Already exists
     ├── query-client.ts                   # React Query client instance
     └── providers.tsx                     # Root providers (QueryClient, Toaster)

 ---
 3. Root Setup Files

 src/lib/query-client.ts

 import { QueryClient } from '@tanstack/react-query'
 export const queryClient = new QueryClient({
   defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
 })

 src/lib/providers.tsx

 'use client'
 import { QueryClientProvider } from '@tanstack/react-query'
 import { queryClient } from './query-client'
 import { Toaster } from '@/components/ui/toast'

 export function Providers({ children }: { children: React.ReactNode }) {
   return (
     <QueryClientProvider client={queryClient}>
       {children}
       <Toaster />
     </QueryClientProvider>
   )
 }

 src/app/layout.tsx (update root layout)

 import { Providers } from '@/lib/providers'
 import { Inter } from 'next/font/google'

 const inter = Inter({ subsets: ['latin'] })

 export default function RootLayout({ children }) {
   return (
     <html lang="en">
       <body className={inter.className}>
         <Providers>{children}</Providers>
       </body>
     </html>
   )
 }

 ---
 4. Authentication & Role Guards

 Pattern: Middleware-based route protection

 Create src/middleware.ts at the apps/web/ level:
 // Protect /dashboard, /provider/*, /admin/* routes
 // Redirect unauthenticated users to /auth/sign-in?callbackUrl=...
 // Check user role for /admin routes

 Role Toggle Logic (src/components/shared/role-toggle.tsx)

 - Store active role in localStorage or user session data
 - If user is a service provider: show "Switch to Customer" / "Switch to Provider"
 - If user is only a customer: show "Become a Provider" → redirect to /provider/documents
 - Toggle updates a context value that changes the sidebar/dashboard shown

 ---
 5. Page-by-Page Implementation Guide

 ---
 PAGE 1: Landing Page (/) — Public

 Layout: Full-width, Navbar + Footer

 Sections:
 1. Hero — Full-width banner, large headline ("Book trusted services near you"), search bar, 2 CTA buttons (Browse Services, Become a Provider)
 2. Category Icons Row — Horizontal scroll of service categories fetched from GET /v1/api/service-categories, icon + label, click → /services?category=id
 3. How It Works — 3-step cards (Browse → Book → Done), icons, clean text
 4. Featured Providers — 4-6 provider cards, pulled from GET /v1/api/admin/providers or a public endpoint
 5. Trust Bar — "Verified Providers", "Secure Payments", "Rated 4.8★" stats row

 API calls: useListServiceCategoriesQuery()

 ---
 PAGE 2: Browse Services (/services) — Public

 Layout: Navbar + Footer, sidebar filters

 Sections:
 1. Filter sidebar — Category filter (checkboxes), rating filter, location
 2. Provider grid — Responsive card grid, each card shows: photo, name, category badge, rating, price range, "Book Now" button
 3. Pagination — Numeric pagination at bottom

 API calls: useListAdminProvidersQuery({ status: 'approved' }) or public endpoint

 ---
 PAGE 3: Provider Profile (/providers/[id]) — Public

 Layout: Full-width, Navbar

 Sections:
 1. Header — Cover photo (or gradient), avatar, name, category, rating stars, review count, "Book Now" sticky CTA
 2. About — Bio text, location, member since
 3. Portfolio Grid — Photo grid from GET /v1/api/service-providers/{id}/portfolio
 4. Reviews — Star summary + review cards from GET /v1/api/reviews/provider/{id}
 5. Booking Modal — Opens on "Book Now": date picker, address input, description, estimated price → POST /v1/api/bookings

 API calls:
 - useGetServiceProviderPortfolioQuery({ id })
 - useGetReviewsProviderQuery({ id })
 - useCreateBookingMutation()

 ---
 PAGE 4: Customer Dashboard (/dashboard) — Protected

 Layout: Sidebar + content area

 Sections:
 1. Welcome banner — Name, avatar, quick stats (total bookings, active, completed)
 2. Upcoming Bookings — 3 most recent pending/confirmed bookings as cards
 3. Recent Messages — 3 latest conversation previews
 4. Quick Actions — "Book a Service", "View All Bookings", "Messages"

 API calls:
 - useListBookingsQuery()
 - useListConversationsQuery()

 ---
 PAGE 5: My Bookings (/bookings) — Protected

 Layout: Sidebar

 Sections:
 1. Tab bar — All | Pending | Confirmed | In Progress | Completed | Cancelled
 2. Booking list — Each row: service category, provider name, date, status badge, "View Details" link
 3. Pagination

 API calls: useListBookingsQuery({ status })

 ---
 PAGE 6: Booking Detail (/bookings/[id]) — Protected

 Layout: Sidebar

 Sections:
 1. Status timeline — Visual stepper: Pending → Confirmed → In Progress → Completed
 2. Booking Info — Provider, category, date/time, address, description
 3. Payment Status — If unpaid: "Make Payment" button. If paid: receipt summary
 4. Actions — Cancel (if pending), Reschedule (if pending), Leave Review (if completed)
 5. Chat Button — Opens conversation with provider

 API calls:
 - useGetBookingQuery({ id })
 - useGetPaymentByBookingQuery({ bookingId: id })
 - useCancelBookingMutation()
 - useRescheduleBookingMutation()

 ---
 PAGE 7: Payment (/bookings/[id]/payment) — Protected

 Layout: Centered card, no sidebar

 Sections:
 1. Booking summary — Provider, amount, date
 2. Payment upload — Bank transfer instructions + file upload for proof screenshot
 3. Submit button — POST /v1/api/payments with multipart form

 API calls: useCreatePaymentMutation()

 ---
 PAGE 8: Messages (/messages) — Protected

 Layout: Split panel (conversation list left, chat right)

 Left panel:
 - List of conversations from GET /v1/api/conversations
 - Each item: avatar, name, last message preview, timestamp, unread dot

 Right panel:
 - Messages list (scrollable) from GET /v1/api/conversations/{id}/messages
 - Message input + send button → POST /v1/api/conversations/{id}/messages
 - Auto-scroll to bottom on new message

 API calls:
 - useListConversationsQuery()
 - useGetConversationMessagesQuery({ id })
 - useSendMessageMutation()
 - Poll messages every 5s (until WebSocket added)

 ---
 PAGE 9: Profile (/profile) — Protected

 Layout: Sidebar

 Sections:
 1. Avatar upload — Circle avatar with camera icon overlay → PATCH /v1/api/users/me/profile-photo
 2. Profile form — Name, phone number → PATCH /v1/api/users/me
 3. Account info — Email (read-only), role badges

 API calls:
 - useGetMeQuery()
 - useUpdateMeMutation()
 - useUpdateMeProfilePhotoMutation()

 ---
 PAGE 10: Addresses (/profile/addresses) — Protected

 Layout: Sidebar

 Sections:
 1. Address list — Cards with label, address text, "Default" badge, Edit/Delete/Set Default actions
 2. Add Address — Modal with form: label, address text, lat/lng (map or manual), isDefault

 API calls:
 - useListCustomerAddressesQuery()
 - useCreateCustomerAddressMutation()
 - useUpdateCustomerAddressMutation()
 - useDeleteCustomerAddressMutation()
 - useSetDefaultAddressMutation()

 ---
 PAGE 11: Provider Dashboard (/provider/dashboard) — Protected

 Layout: Provider sidebar

 Sections:
 1. Verification banner — If pending/rejected: yellow/red alert with status + action
 2. Stats row — Today's jobs, this month's earnings, total completed, avg rating
 3. Today's Jobs — Sorted list of today's bookings
 4. Pending Actions — Bookings needing status update

 API calls: useListBookingsQuery() (provider view)

 ---
 PAGE 12: Provider Bookings (/provider/bookings) — Protected

 Layout: Provider sidebar

 Similar to customer bookings list but with extra action: Update Status dropdown on each row.

 API calls:
 - useListBookingsQuery()
 - useUpdateBookingStatusMutation()

 ---
 PAGE 13: Provider Job Detail (/provider/bookings/[id]) — Protected

 Layout: Provider sidebar

 1. Customer info — Name, address on map/text
 2. Job details — Description, scheduled time, category
 3. Status updater — Button group: Accept → Start → Complete
 4. Completion photo upload — POST /v1/api/bookings/{id}/complete-photo
 5. Chat with customer button

 ---
 PAGE 14: Provider Documents (/provider/documents) — Protected

 Layout: Provider sidebar

 1. Verification status banner — Pending / Approved / Rejected + admin note
 2. CNIC upload — Front + back image upload areas
 3. Submit button → POST /v1/api/service-providers/me/documents

 ---
 PAGE 15: Provider Portfolio (/provider/portfolio) — Protected

 Layout: Provider sidebar

 1. Photo grid — Existing portfolio images with delete checkbox
 2. Upload zone — Drag & drop multi-image upload
 3. Delete selected button

 API calls:
 - useGetServiceProviderPortfolioQuery({ id: 'me' })
 - useUploadPortfolioMutation()
 - useDeletePortfolioMutation()

 ---
 PAGE 16: Notifications (/notifications) — Protected

 Layout: Sidebar

 1. Mark all read button
 2. Notification list — Icon by type, title, body, timestamp, unread dot
 3. On click: mark as read + navigate to relevant page

 API calls:
 - useListNotificationsQuery()
 - useMarkNotificationsReadMutation()
 - useMarkAllNotificationsReadMutation()

 ---
 ADMIN PAGES (all at /admin/*)

 Layout: Admin sidebar (always dark/solid)

 /admin — Dashboard

 - KPI cards: total bookings, revenue, active providers, new customers
 - Quick charts: bookings over time, revenue trend (use recharts or tremor)
 - GET /v1/api/admin/dashboard + GET /v1/api/admin/analytics

 /admin/providers — Provider Management

 - Table: name, category, status badge, joined date, actions (View, Suspend, Ban)
 - Filter by status: All | Pending | Approved | Rejected
 - GET /v1/api/admin/providers

 /admin/providers/[id] — Provider Verification

 - Full profile view: documents (CNIC images), portfolio grid, personal info
 - Action buttons: Approve / Reject / Request More Info + note textarea
 - GET /v1/api/admin/providers/{id} + PATCH /v1/api/admin/providers/{id}/verify

 /admin/customers — Customer Management

 - Table: name, email, phone, joined, booking count, actions (Suspend, Ban)
 - GET /v1/api/admin/customers

 /admin/bookings — All Bookings

 - Table with filters: status, date range, provider, customer
 - Actions: Reassign provider, Trigger refund
 - GET /v1/api/admin/bookings

 /admin/payments — Payments

 - Table: amount, customer, status, date
 - Actions: Approve / Reject with reason
 - GET /v1/api/admin/payments + PATCH approve/reject

 /admin/payouts — Payout Requests

 - Table: provider, amount, requested date, status
 - Approve button per row
 - GET /v1/api/admin/payouts + POST /v1/api/admin/payouts/{id}/approve

 /admin/fraud — Fraud Flags

 - Table: user, reason, flagged date, status
 - Actions: Investigate / Suspend / Clear
 - GET /v1/api/admin/fraud-flags + PATCH /v1/api/admin/fraud-flags/{id}

 /admin/categories — Service Categories

 - Grid of category cards with image, name, active toggle
 - Add category modal, Edit inline, Delete with confirm dialog
 - GET/POST/PATCH/DELETE /v1/api/service-categories

 /admin/commission — Commission Settings

 - Table of tiers with editable rate inputs
 - Save all button
 - GET/PATCH /v1/api/admin/commission-settings

 ---
 6. Key Shared Components Detail

 components/layout/navbar.tsx

 [Logo]   [Services] [Browse Providers]      [Role Toggle] [Bell] [Avatar ▼]
                                             (if logged in)
                                             [Sign In] [Join]
                                             (if logged out)
 - Role toggle: pill button "Switch to Provider" / "Switch to Customer"
 - Bell: shows unread count, click opens notification dropdown (top 5)
 - Avatar: dropdown with Profile, My Bookings, Sign Out

 components/shared/status-badge.tsx

 // Maps booking/payment status to color
 pending    → yellow badge
 confirmed  → blue badge
 in_progress → orange badge
 completed  → green badge
 cancelled  → red badge

 components/cards/provider-card.tsx

 [Photo]
 [Name]          [Rating ★ 4.8]
 [Category Tag]
 [Location]      [PKR 500-2000/hr]
 [Book Now btn]

 components/shared/role-toggle.tsx

 - Reads current active role from auth session or localStorage
 - If user.role === 'provider': shows toggle between customer/provider dashboard
 - If user.role === 'customer': shows "Become a Provider" link
 - Switching role → router.push('/dashboard') or router.push('/provider/dashboard')

 ---
 7. API Integration Pattern

 Always follow this pattern in components:
 // ✅ Correct pattern
 'use client'
 import { useListBookingsQuery } from '@repo/api-client'

 export function BookingsList() {
   const { data, isLoading, error } = useListBookingsQuery()

   if (isLoading) return <BookingsSkeleton />
   if (error) return <ErrorState message="Failed to load bookings" />
   if (!data?.data?.length) return <EmptyState message="No bookings yet" />

   return data.data.map(b => <BookingCard key={b.id} booking={b} />)
 }

 For mutations:
 import { useCreateBookingMutation } from '@repo/api-client'
 import { toast } from '@/components/ui/toast'

 const { mutate, isPending } = useCreateBookingMutation({
   onSuccess: () => { toast.success('Booking created!'); router.push('/bookings') },
   onError: (err) => toast.error(err.data?.message ?? 'Something went wrong'),
 })

 ---
 8. Implementation Phases

 Phase 1 — Foundation (Week 1)

 - Update globals.css with design tokens
 - Add missing shadcn components: badge, avatar, card, dialog, select, textarea, skeleton, tabs, toast, table
 - Create src/lib/providers.tsx (QueryClient + Toaster)
 - Update src/app/layout.tsx to wrap with Providers
 - Build Navbar, Footer, SidebarCustomer, SidebarProvider, SidebarAdmin
 - Build shared: StatusBadge, EmptyState, LoadingSpinner, PageHeader
 - Update auth pages to match new design system

 Phase 2 — Public Pages (Week 1-2)

 - Landing page (/) with all 5 sections
 - Browse services page (/services)
 - Provider profile page (/providers/[id]) with portfolio + reviews + booking modal

 Phase 3 — Customer Flow (Week 2)

 - Customer dashboard (/dashboard)
 - Bookings list + detail (/bookings, /bookings/[id])
 - Payment page (/bookings/[id]/payment)
 - Profile + addresses (/profile, /profile/addresses)
 - Notifications (/notifications)

 Phase 4 — Messages (Week 2-3)

 - Messages split-panel layout
 - Conversation list + chat thread
 - Polling for new messages (every 5s)

 Phase 5 — Provider Flow (Week 3)

 - Provider dashboard (/provider/dashboard)
 - Provider bookings + job detail
 - Documents upload (CNIC verification)
 - Portfolio management

 Phase 6 — Admin Panel (Week 3-4)

 - Admin layout + sidebar
 - Dashboard with KPIs
 - Provider verification flow
 - All management tables (customers, bookings, payments, payouts, fraud)
 - Category + commission management

 Phase 7 — Polish (Week 4)

 - Mobile responsive check on all pages
 - Loading skeletons on every data-fetching page
 - Error boundaries
 - Empty states with illustrations
 - Toast notifications for all mutations

 ---
 9. shadcn Components to Install

 Run these from apps/web/:
 npx shadcn@latest add badge avatar card dialog dropdown-menu select textarea skeleton tabs toast table separator sheet scroll-area

 ---
 10. Environment Variables

 Add to apps/web/.env:
 NEXT_PUBLIC_API_URL=http://localhost:9999

 And update src/mutator/custom-fetch.ts to read NEXT_PUBLIC_API_URL instead of VITE_API_URL (since this is Next.js, not Vite).

 ---
 Verification

 After building each phase:
 1. npm run dev in apps/web/
 2. Visit each route and confirm: data loads, loading states show, errors handle gracefully
 3. Test role switching (customer ↔ provider)
 4. Test full booking flow: browse → book → pay → complete → review
 5. Test admin: verify a provider, approve a payment, handle a payout