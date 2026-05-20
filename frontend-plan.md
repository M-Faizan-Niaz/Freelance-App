 Frontend Development Plan — Service Marketplace (TaskRabbit-Inspired)

 Context

 This is a Pakistan-based on-demand service marketplace (electricians, plumbers, AC repair, cleaning, etc.) built on Next.js 16 + Tailwind CSS + Shadcn/UI inside a monorepo. The user wants the web frontend to
  look and feel like TaskRabbit — clean, category-driven, trust-focused, with transparent pricing. The full feature spec lives in FRONTEND_SPEC.md. The backend API is already built (Hono.js, modules live in
 packages/api/). The generated React Query client is at packages/api-client/.

 Design reference: TaskRabbit — hero with search, category grid, stats/trust section, how-it-works strip, featured provider cards, footer with links.
 Pakistan context: PKR (₨), +92 phone numbers, Urdu/English toggle, Google Maps Pakistan region.

 ---
 Current State

 ┌──────────────────────────┬────────────────────────────┐
 │           Path           │           Status           │
 ├──────────────────────────┼────────────────────────────┤
 │ app/auth/sign-in         │ ✅ Done                    │
 ├──────────────────────────┼────────────────────────────┤
 │ app/auth/sign-up         │ ✅ Done                    │
 ├──────────────────────────┼────────────────────────────┤
 │ app/auth/forgot-password │ ✅ Done                    │
 ├──────────────────────────┼────────────────────────────┤
 │ app/auth/otp             │ ✅ Done                    │
 ├──────────────────────────┼────────────────────────────┤
 │ app/auth/verify-email    │ ✅ Done                    │
 ├──────────────────────────┼────────────────────────────┤
 │ app/auth/reset-password  │ ✅ Done                    │
 ├──────────────────────────┼────────────────────────────┤
 │ app/page.tsx             │ ⚠️ Placeholder (TodoApp)   │
 ├──────────────────────────┼────────────────────────────┤
 │ app/become-provider/     │ ❌ Empty                   │
 ├──────────────────────────┼────────────────────────────┤
 │ app/how-it-works/        │ ❌ Empty                   │
 ├──────────────────────────┼────────────────────────────┤
 │ app/services/            │ ❌ Empty                   │
 ├──────────────────────────┼────────────────────────────┤
 │ app/services/[slug]/     │ ❌ Empty                   │
 ├──────────────────────────┼────────────────────────────┤
 │ components/ui/           │ ✅ Button, Input, Checkbox │
 ├──────────────────────────┼────────────────────────────┤
 │ components/home/         │ ❌ Empty                   │
 └──────────────────────────┴────────────────────────────┘

 ---
 Module Build Order

 ---
 Module 1 — Design System & Global Styles

 Goal: Establish the visual language used across every module.

 Files to create/modify:
 - app/globals.css — extend existing CSS variables
 - components/ui/ — add missing Shadcn primitives

 Design tokens (aligned with FRONTEND_SPEC.md):
 Primary Blue:   #1A73E8  (CTAs, links, active states)
 Secondary Orange: #FF6B35 (highlights, badges, price tags)
 Success Green:  #34A853
 Error Red:      #EA4335
 Warning Yellow: #FBBC04
 Background:     #FFFFFF / #F8F9FA (light gray pages)
 Text Primary:   #202124
 Text Secondary: #5F6368
 Border:         #E8EAED

 Shadcn components to add (run shadcn CLI):
 - badge, card, avatar, skeleton, sheet, dialog, select, tabs,
 dropdown-menu, separator, popover, calendar, progress, toast,
 textarea, label, radio-group, switch

 Shared utility components to build:
 - components/ui/star-rating.tsx — 5-star display + interactive
 - components/ui/badge-chip.tsx — Bronze/Silver/Gold tier chips
 - components/ui/verification-badge.tsx — CNIC verified, background check icons
 - components/ui/skeleton-card.tsx — shimmer loading state
 - components/ui/empty-state.tsx — illustration + message + CTA
 - components/ui/price-tag.tsx — "Starting from ₨X" display

 ---
 Module 2 — Layout & Navigation

 Goal: Persistent header, footer, and page wrapper used by all public pages.

 Files to create:
 - components/layout/navbar.tsx
 - components/layout/footer.tsx
 - components/layout/page-wrapper.tsx
 - app/layout.tsx — update root layout to include Navbar + Footer

 Navbar (TaskRabbit-style):
 - Left: Logo (brand name + icon)
 - Center: Service categories dropdown (Assembly, Cleaning, Repairs, Moving, Outdoor, Painting…)
 - Right: Search icon | Location pill | Sign in / Sign up buttons | "Become a Provider" CTA (orange)
 - Authenticated state: Notifications bell | Bookings link | Avatar dropdown (Profile, Bookings, Settings, Logout)
 - Mobile: Hamburger menu → full-screen drawer with same links

 Footer (3-column):
 - Column 1 — Discover: Browse Services, Cities, Cost Guides, How It Works
 - Column 2 — Company: About, Careers, Blog, Press, Partnerships
 - Column 3 — Support: Help Center, Safety, Terms, Privacy Policy
 - Bottom: Social icons (Facebook, Instagram, TikTok, LinkedIn) | Language toggle (English / ودرا) | App store badges

 Route protection: Already handled by lib/proxy.ts middleware. No changes needed.

 ---
 Module 3 — Homepage

 Goal: Full landing page like TaskRabbit homepage.

 Files to create:
 - app/page.tsx — replace TodoApp placeholder with composed sections
 - components/home/hero-section.tsx
 - components/home/category-grid.tsx
 - components/home/stats-strip.tsx
 - components/home/how-it-works-strip.tsx
 - components/home/featured-providers.tsx
 - components/home/testimonials.tsx
 - components/home/app-download-banner.tsx

 Sections (top to bottom):

 Hero Section

 - Full-width background (gradient or lifestyle photo)
 - Headline: "Book Trusted Help — Instantly" (large, bold)
 - Subheading: "Verified professionals for home services across Pakistan"
 - Search bar: text input + location dropdown + "Find Help" button (primary blue)
 - Quick-link service pills below search: Electrician | Plumber | AC Repair | Cleaning | Painter | Moving
 - Trust badges row: ✓ Background Checked · ✓ Verified CNIC · ✓ Secure Payment

 Category Grid

 - 2-column (mobile) / 4-column (desktop) card grid
 - Each card: category icon (SVG), label, subcategory count
 - Categories: Electrician, Plumber, AC & Appliances, Cleaning, Painting, Moving, Carpenter, Outdoor
 - Hoverable with subtle scale + shadow animation
 - "View all services →" link below grid

 Stats Strip (trust signals)

 - 3 stats in a horizontal band (light blue/gray bg):
   - "50,000+ Tasks Completed"
   - "5,000+ Verified Professionals"
   - "4.8★ Average Rating"
 - Animated count-up on scroll (IntersectionObserver)

 How It Works Strip

 - 3 steps horizontal (icon + number + title + description):
   a. Pick a Service → Browse categories and describe your task
   b. Get Matched → Choose from verified professionals near you
   c. Done & Paid → Secure escrow payment, released on completion
 - CTA: "Book Now" button

 Featured Provider Cards (carousel/grid)

 - 3–4 provider cards (data from API)
 - Each card: avatar, name, category badge, rating stars + review count, "Starting from ₨X", tier badge, "View Profile" button
 - Uses components/provider/provider-card.tsx (built in Module 5)

 Testimonials

 - Horizontal scroll on mobile, 3-col grid on desktop
 - Each testimonial: quote, customer name, city, service category, star rating
 - Static data initially, later from API

 App Download Banner

 - "Take us with you" — App Store + Google Play badges
 - Phone mockup illustration on the right
 - Light background, prominent CTAs

 ---
 Module 4 — How It Works Page

 Goal: Standalone /how-it-works page.

 Files to create:
 - app/how-it-works/page.tsx
 - components/how-it-works/steps-section.tsx
 - components/how-it-works/trust-section.tsx
 - components/how-it-works/faq-section.tsx

 Sections:
 1. Hero — "Simple. Safe. Done." headline + subtext
 2. Customer Journey — 5-step vertical timeline with icons: Browse → Book → Provider Arrives → Job Done → Pay & Review
 3. Provider Journey — "Want to earn?" side panel with 3 steps: Sign Up → Get Verified → Start Earning
 4. Trust Pillars — 4 cards: Background Checks, CNIC Verification, Escrow Payments, Happiness Pledge
 5. FAQ Accordion — 6–8 common questions (Shadcn Accordion component)
 6. CTA Banner — "Ready to book?" → Book Now (blue) + "Earn with us" → Become a Provider (orange)

 ---
 Module 5 — Services Discovery

 Goal: /services listing page and /services/[slug] category detail page.

 Files to create:
 - app/services/page.tsx
 - app/services/[slug]/page.tsx
 - app/services/_components/category-card.tsx
 - app/services/_components/service-filter-bar.tsx
 - app/services/_components/provider-list.tsx
 - app/services/_components/provider-card.tsx (also exported as components/provider/provider-card.tsx)
 - app/services/_components/map-toggle.tsx

 /services (Category Listing):
 - Page header: "All Services" + search bar
 - Category card grid (same pattern as homepage but larger, with subcategory list shown)
 - Each card links to /services/[slug]

 /services/[slug] (Service Category Page — like TaskRabbit's per-service page):
 - Breadcrumb: Home > Services > Cleaning
 - Page title + short description of the service
 - Filter bar: chips — All | Available Today | Top Rated | Verified | Under ₨1000
 - Advanced filter sheet (Shadcn Sheet): Rating min, Max price, Distance, Sort (Rating / Price / Distance)
 - Provider results list:
   - Provider card: avatar, name, badge tier, category, rating + count, bio snippet, response time, "Starting from ₨X", "Book Now" button + "View Profile" link
   - Skeleton loading state while fetching
   - Empty state illustration if no results
 - Map toggle button (top-right): splits view into list + map side-by-side (Google Maps iframe or static map initially)
 - Pagination or infinite scroll

 ---
 Module 6 — Service Provider Profile Page

 Goal: Full provider detail page at /providers/[id].

 Files to create:
 - app/providers/[id]/page.tsx
 - app/providers/[id]/_components/profile-header.tsx
 - app/providers/[id]/_components/stats-bar.tsx
 - app/providers/[id]/_components/portfolio-gallery.tsx
 - app/providers/[id]/_components/services-offered.tsx
 - app/providers/[id]/_components/availability-calendar.tsx
 - app/providers/[id]/_components/reviews-section.tsx
 - app/providers/[id]/_components/booking-sidebar.tsx

 Layout: 2-column desktop (main content left, sticky booking sidebar right), single-column mobile.

 Sections:
 - Profile Header: cover photo, avatar, name, badge chip, category, city, verification badges (CNIC ✓, Background ✓), online/offline dot
 - Stats Bar: Jobs Completed | Response Rate | Avg Response Time | Member Since
 - Bio: "About me" text section
 - Services Offered: list of services with individual prices
 - Portfolio Gallery: 2-column masonry/grid (up to 12 photos, click to lightbox)
 - Availability Calendar: 7-day scroll strip showing available / unavailable days (read-only view)
 - Customer Reviews:
   - Rating summary (X.X / 5, bar chart breakdown: 5★ N%, 4★ N%…)
   - Review cards (avatar, name, date, stars, comment, service booked)
   - "Load more" pagination
 - Sticky Booking Sidebar (desktop) / Bottom CTA bar (mobile):
   - Service selector dropdown
   - "Starting from ₨X"
   - "Book [Provider Name]" button (primary blue, large)
   - "Message" button (secondary)

 ---
 Module 7 — Booking Flow

 Goal: Multi-step booking flow after clicking "Book Now".

 Files to create:
 - app/booking/page.tsx — step container with progress bar
 - app/booking/_components/step-service.tsx — Step 1: select service + describe job
 - app/booking/_components/step-schedule.tsx — Step 2: date + time slot picker
 - app/booking/_components/step-address.tsx — Step 3: address input + saved addresses
 - app/booking/_components/step-estimate.tsx — Step 4: price estimate display
 - app/booking/_components/step-confirm.tsx — Step 5: order summary + confirm
 - app/booking/confirmation/page.tsx — post-booking success screen

 Step 1 — Service Selection:
 - Service type dropdown (pre-filled if coming from provider page)
 - Job description textarea (max 500 chars)
 - Optional photo upload (up to 3 images)

 Step 2 — Schedule:
 - 7-day date strip (scroll, today + 6 days, highlight selected)
 - Time slot grid (Morning / Afternoon / Evening buckets)
 - Provider availability shown (green = available, gray = taken)

 Step 3 — Address:
 - Address search input (Google Places Autocomplete)
 - Saved addresses list (if logged in)
 - "Add new address" form: street, area, city, floor/unit

 Step 4 — Price Estimate:
 - Category icon + service name
 - Estimated time range (e.g., "1–2 hours")
 - Cost breakdown: Labor (₨X) + Parts estimate (₨X) + Platform fee (₨X)
 - Total estimate with note "Final price confirmed after job"

 Step 5 — Confirm:
 - Provider summary card (avatar, name, rating)
 - Job summary (service, date, time, address)
 - Price estimate total
 - "Confirm Booking" button

 Confirmation Page:
 - Success animation (checkmark)
 - Booking ID displayed
 - Provider details + contact options
 - Action buttons: Track Provider | Chat | View Bookings
 - Share booking button

 State management: React useReducer or Zustand slice for multi-step form state.

 ---
 Module 8 — Become a Provider (Registration Flow)

 Goal: Multi-step provider sign-up at /become-provider.

 Files to create:
 - app/become-provider/page.tsx — landing/marketing page
 - app/auth/register-provider/page.tsx — 3-step registration form

 Landing Page (/become-provider):
 - Hero: "Earn on your schedule" + earnings stats
 - Benefits: Set your own rates | Work when you want | Get paid securely
 - How it works (3 steps): Sign Up → Get Verified → Start Earning
 - Earnings examples: "Electricians earn avg ₨X/month"
 - "Get Started" CTA → /auth/register-provider

 Registration (3 Steps):

 Step 1 — Personal Info:
 - Full name, phone (+92), email, password, confirm password
 - Profile photo upload

 Step 2 — Professional Info:
 - Category selector (multi-select)
 - Years of experience (number)
 - Service area (city/district selector)
 - Bio textarea
 - Portfolio images upload (up to 6)

 Step 3 — Verification:
 - CNIC number input (XXXXX-XXXXXXX-X format)
 - CNIC front photo upload
 - CNIC back photo upload
 - Trade license upload (optional)
 - Police clearance upload (optional)
 - Terms & Conditions checkbox
 - Submit → "Application Under Review" confirmation screen

 ---
 Module 9 — Customer Dashboard

 Goal: Authenticated area for customers — bookings, profile, addresses.

 Files to create:
 - app/dashboard/page.tsx — overview/home
 - app/dashboard/bookings/page.tsx — booking history
 - app/dashboard/bookings/[id]/page.tsx — booking detail + tracking
 - app/dashboard/profile/page.tsx — edit profile
 - app/dashboard/addresses/page.tsx — manage saved addresses
 - app/dashboard/payments/page.tsx — payment methods + transaction history
 - components/dashboard/booking-card.tsx
 - components/dashboard/sidebar-nav.tsx

 Layout: Left sidebar nav (desktop) / bottom sheet tabs (mobile)
 - Sidebar links: Overview | My Bookings | Profile | Addresses | Payment Methods | Notifications | Help

 Bookings Page:
 - Tab bar: Active | Upcoming | Past
 - Booking card: provider avatar, name, service, date, status chip (Confirmed/In Progress/Completed/Cancelled), "View Details" + context actions

 Booking Detail:
 - Full timeline (Accepted → Travelling → Arrived → In Progress → Completed)
 - Provider info + "Chat" button
 - Job notes
 - Payment breakdown
 - "Leave Review" button (if completed, no review yet)
 - "Cancel Booking" button (if upcoming, cancellation policy shown)

 Profile Edit:
 - Avatar upload, name, phone, email fields
 - Change password section
 - Language preference (English / Urdu)
 - Notification settings toggles
 

 ---
 Module 10 — Provider Dashboard

 Goal: Authenticated area for service providers.

 Files to create:
 - app/provider-dashboard/page.tsx — daily overview
 - app/provider-dashboard/jobs/page.tsx — job requests + active jobs
 - app/provider-dashboard/jobs/[id]/page.tsx — job detail + status management
 - app/provider-dashboard/earnings/page.tsx — earnings + payout
 - app/provider-dashboard/profile/page.tsx — edit provider profile
 - app/provider-dashboard/availability/page.tsx — weekly schedule
 - app/provider-dashboard/badge/page.tsx — tier status
 - components/provider-dashboard/online-toggle.tsx
 - components/provider-dashboard/job-request-overlay.tsx
 - components/provider-dashboard/earnings-chart.tsx

 Dashboard Home:
 - Online/Offline toggle (large animated pill — green/gray)
 - Today's stats cards: Jobs Today | Earnings Today (₨) | Avg Rating
 - Incoming job request overlay (30s countdown timer, Accept/Reject)
 - Active job card (if any job in progress)
 - Recent activity list (last 5 jobs)

 Job Request Detail:
 - Customer info (avatar, name, rating)
 - Service requested, address + map preview, distance, travel time
 - Proposed schedule
 - Estimated earnings breakdown (gross − platform commission = net)
 - Accept / Reject buttons

 Active Job Flow:
 - Status progress bar: Accepted → Travelling → Arrived → In Progress → Completed
 - "I've Arrived" button → "Start Job" → "Mark Complete"
 - Photo upload for job completion proof
 - Chat + Navigation buttons

 Earnings Dashboard:
 - Total earnings header (large ₨ display)
 - Period selector: Today | This Week | This Month | Custom Range
 - Bar chart (earnings by day/week) — use Recharts or Chart.js
 - Summary cards: Gross | Commission | Net Payout
 - Recent transactions table
 - Payout section: Available balance + "Request Payout" button

 Availability Management:
 - Weekly grid (Mon–Sun × Morning/Afternoon/Evening)
 - Toggle slots on/off
 - "Vacation Mode" date range picker

 ---
 Module 11 — In-App Chat

 Goal: Real-time messaging between customer and provider.

 Files to create:
 - app/chat/page.tsx — conversation list
 - app/chat/[conversationId]/page.tsx — active chat
 - components/chat/message-bubble.tsx
 - components/chat/quick-reply-chips.tsx
 - components/chat/chat-header.tsx

 Chat List:
 - List of conversations with last message preview, timestamp, unread count badge
 - Each row: avatar, name, last message snippet, time

 Active Chat:
 - Header: provider/customer avatar, name, online status dot, booking context link
 - Message bubbles (sent right, received left) with timestamps
 - Quick-reply chips: "On my way" | "Running 15 min late" | "Job complete"
 - Safety banner: "Never share payment outside the app"
 - Text input + send button + attachment (photo) button
 - Optimistic UI for sent messages

 Note: Real-time via WebSocket or polling; use the existing backend conversation/message API.

 ---
 Module 12 — Payment Flow

 Goal: Payment screen + success confirmation.

 Files to create:
 - app/payment/[bookingId]/page.tsx
 - app/payment/[bookingId]/success/page.tsx
 - components/payment/payment-method-selector.tsx
 - components/payment/card-form.tsx
 - components/payment/promo-code-input.tsx

 Payment Page:
 - Order summary card (provider, service, date, subtotal)
 - Payment method selector: JazzCash | EasyPaisa | Debit/Credit Card | Cash on Completion
 - Card form (conditional, shown only when card selected): card number, expiry, CVV
 - Promo code input field + "Apply" button
 - Price breakdown: Subtotal | Discount | Platform Fee | Total
 - Escrow info banner: "Your payment is held securely until the job is complete"
 - "Pay ₨X" button (large, primary blue)

 Success Page:
 - Animated success checkmark
 - Transaction ID
 - Amount paid
 - Buttons: View Booking | Download Receipt | Back to Home

 ---
 Module 13 — Review & Rating

 Goal: Post-job review submission.

 Files to create:
 - app/review/[bookingId]/page.tsx
 - components/review/star-selector.tsx
 - components/review/tag-chips.tsx

 Review Page:
 - Provider photo + name + job completed
 - 5-star interactive selector (tap/click)
 - Category tag chips: Professional | On Time | Good Work | Friendly | Great Value
 - Written review textarea (optional, max 500 chars)
 - Photo upload (up to 3 images, optional)
 - "Submit Review" button
 - Skip option (small text link)

 ---
 Module 14 — Notifications

 Goal: Notification center for both customers and providers.

 Files to create:
 - app/notifications/page.tsx
 - components/notifications/notification-item.tsx

 Notification List:
 - Grouped by: Today | Yesterday | Earlier
 - Each item: icon (booking/payment/chat/system), title, body, timestamp, unread dot
 - Mark all as read button
 - Click notification → navigate to relevant page (booking, chat, etc.)

 ---
 Shared Component Library Summary

 All reusable components live in components/:

 components/
 ├── ui/                    # Shadcn primitives (button, input, card, badge…)
 ├── layout/                # Navbar, Footer, PageWrapper
 ├── home/                  # Hero, CategoryGrid, StatsStrip, HowItWorks, FeaturedProviders, Testimonials
 ├── provider/              # ProviderCard (used in home + services pages)
 ├── dashboard/             # BookingCard, SidebarNav
 ├── provider-dashboard/    # OnlineToggle, JobRequestOverlay, EarningsChart
 ├── chat/                  # MessageBubble, QuickReplyChips, ChatHeader
 ├── payment/               # PaymentMethodSelector, CardForm, PromoCodeInput
 ├── review/                # StarSelector, TagChips
 └── notifications/         # NotificationItem

 ---
 File & Route Map

 app/
 ├── page.tsx                          # Module 3 — Homepage
 ├── how-it-works/page.tsx             # Module 4
 ├── services/page.tsx                 # Module 5 — Category listing
 ├── services/[slug]/page.tsx          # Module 5 — Per-category providers
 ├── providers/[id]/page.tsx           # Module 6 — Provider profile
 ├── booking/page.tsx                  # Module 7 — Booking flow
 ├── booking/confirmation/page.tsx     # Module 7
 ├── become-provider/page.tsx          # Module 8 — Landing
 ├── auth/register-provider/page.tsx   # Module 8 — 3-step form
 ├── dashboard/                        # Module 9 — Customer dashboard
 │   ├── page.tsx
 │   ├── bookings/page.tsx
 │   ├── bookings/[id]/page.tsx
 │   ├── profile/page.tsx
 │   ├── addresses/page.tsx
 │   └── payments/page.tsx
 ├── provider-dashboard/               # Module 10 — Provider dashboard
 │   ├── page.tsx
 │   ├── jobs/page.tsx
 │   ├── jobs/[id]/page.tsx
 │   ├── earnings/page.tsx
 │   ├── profile/page.tsx
 │   ├── availability/page.tsx
 │   └── badge/page.tsx
 ├── chat/page.tsx                     # Module 11
 ├── chat/[conversationId]/page.tsx    # Module 11
 ├── payment/[bookingId]/page.tsx      # Module 12
 ├── payment/[bookingId]/success/page.tsx
 ├── review/[bookingId]/page.tsx       # Module 13
 └── notifications/page.tsx           # Module 14

 Route protection (proxy.ts) additions:
 - Add /dashboard, /provider-dashboard, /chat, /payment, /review, /notifications to protected prefixes.

 ---
 API Integration

 Use @repo/api-client (Orval-generated React Query hooks) for all data fetching:
 - useGetCategories() — homepage category grid, services page
 - useGetProvidersByCategory(slug, filters) — services/[slug] page
 - useGetProviderById(id) — provider profile
 - useCreateBooking() — booking flow
 - useGetBookings(status) — customer dashboard
 - useGetProviderJobs(status) — provider dashboard
 - useGetConversations() / useGetMessages(id) — chat
 - useCreatePayment(bookingId) — payment flow
 - useCreateReview(bookingId) — review page
 - useGetNotifications() — notification center
 - useGetEarnings(period) — provider earnings

 ---
 Verification & Testing

 After each module:
 1. Run dev server: pnpm dev from repo root
 2. Visual check: open https://web.viteplusmono.test in browser
 3. Responsive check: test at 375px (mobile), 768px (tablet), 1280px (desktop)
 4. Auth flow check: verify protected routes redirect to /auth/sign-in when logged out
 5. API integration: verify React Query hooks fetch correctly, skeletons show on load, empty states show when no data
 6. TypeScript: pnpm typecheck — zero errors per module before moving to next
 7. Accessibility: check keyboard nav, focus rings, ARIA labels on interactive elements

 ---
 Build Sequence

 ┌─────┬──────────────────────────────┬─────────────────┐
 │  #  │            Module            │ Est. Complexity │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 1   │ Design System & Shadcn Setup │ Low             │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 2   │ Navbar + Footer + Layout     │ Low             │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 3   │ Homepage                     │ Medium          │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 4   │ How It Works Page            │ Low             │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 5   │ Services Discovery           │ Medium          │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 6   │ Provider Profile Page        │ Medium          │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 7   │ Booking Flow                 │ High            │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 8   │ Become a Provider            │ Medium          │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 9   │ Customer Dashboard           │ High            │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 10  │ Provider Dashboard           │ High            │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 11  │ Chat                         │ High            │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 12  │ Payment Flow                 │ Medium          │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 13  │ Review & Rating              │ Low             │
 ├─────┼──────────────────────────────┼─────────────────┤
 │ 14  │ Notifications                │ Low             │
 └─────┴──────────────────────────────┴─────────────────┘