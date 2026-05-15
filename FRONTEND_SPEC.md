# Service Marketplace App — Frontend Design Specification

> Platform: Web (responsive) + Mobile App (iOS & Android)
> Market: Pakistan
> Languages: English / Urdu
> Design Style: Clean, modern, trust-first (inspired by Careem / Uber)

---

## 1. Design System

### Brand Identity
- **Primary Color**: #1A73E8 (trust blue)
- **Secondary Color**: #FF6B35 (action orange)
- **Success**: #34A853
- **Warning**: #FBBC04
- **Error**: #EA4335
- **Background**: #F8F9FA
- **Surface / Card**: #FFFFFF
- **Text Primary**: #1C1C1E
- **Text Secondary**: #6E6E73
- **Border / Divider**: #E5E5EA

### Badge Colors
- **Bronze**: #CD7F32
- **Silver**: #A8A9AD
- **Gold**: #FFD700

### Typography
- **Font Family**: Inter (web), SF Pro (iOS), Roboto (Android)
- **Heading 1**: 28px / Bold
- **Heading 2**: 22px / SemiBold
- **Heading 3**: 18px / SemiBold
- **Body Large**: 16px / Regular
- **Body Small**: 14px / Regular
- **Caption**: 12px / Regular
- **Button Text**: 16px / SemiBold

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 20px
- Full (pill): 9999px

### Elevation / Shadows
- Card: 0 2px 8px rgba(0,0,0,0.08)
- Modal: 0 8px 32px rgba(0,0,0,0.16)
- Floating Button: 0 4px 16px rgba(0,0,0,0.20)

### Iconography
- Style: Outlined with 2px stroke (Material Icons / SF Symbols equivalent)
- Size: 20px (inline), 24px (nav), 32px (feature icons)

---

## 2. Navigation Structure

### Mobile App — Bottom Tab Navigation (Customer)
1. **Home** — discover services, nearby providers
2. **Search** — browse categories and filter
3. **Bookings** — active and history
4. **Chat** — messages with providers
5. **Profile** — account, settings

### Mobile App — Bottom Tab Navigation (Provider)
1. **Dashboard** — earnings and status overview
2. **Jobs** — incoming requests and active jobs
3. **Earnings** — financial summary
4. **Chat** — messages with customers
5. **Profile** — portfolio, availability, settings

### Web — Top Navigation Bar (Customer)
- Logo | Search Bar | Location | Bookings | Notifications | Profile Avatar

### Web — Sidebar Navigation (Admin Panel)
- Dashboard | Providers | Customers | Bookings | Payments | Reports | Settings

---

## 3. Screen Inventory

### 3.1 Onboarding & Authentication (Shared — Web + Mobile)

#### Screen: Splash Screen
- Full-screen brand background with primary color
- App logo centered (icon + wordmark)
- Tagline: "Your trusted service, at your doorstep"
- Language selector toggle: English | اردو

#### Screen: Onboarding Carousel (3 slides)
- Slide 1: Illustration of customer finding a service provider on a map. Headline: "Find Trusted Professionals Near You"
- Slide 2: Illustration of booking confirmation. Headline: "Book Instantly or Schedule Later"
- Slide 3: Illustration of secure payment. Headline: "Pay Safely, Every Time"
- Each slide: Full-screen illustration (top 60%), headline, sub-description, dot pagination indicator
- Bottom: Skip button (top-right), Next/Get Started CTA button

#### Screen: Login
- App logo (small, top-center)
- Title: "Welcome Back"
- Phone number input field with Pakistan flag + country code (+92)
- Password input field with show/hide toggle
- Forgot Password link
- Primary CTA: "Login" button (full width)
- Divider: "or continue with"
- Google Sign-In button
- Footer link: "Don't have an account? Sign Up"

#### Screen: Sign Up — Choose Role
- Title: "Join as..."
- Two large cards side by side:
  - Card 1: Customer icon + "I need services" + description
  - Card 2: Worker/Wrench icon + "I offer services" + description
- Each card is selectable (tappable, with border highlight on select)
- CTA: "Continue" button

#### Screen: Sign Up — Customer
- Title: "Create Account"
- Full Name input
- Phone Number input (+92 prefix)
- Email input (optional)
- Password input + Confirm Password input
- Location picker (city/area dropdown or map pin)
- Terms & Conditions checkbox with link
- CTA: "Create Account"
- Footer: "Already have an account? Login"

#### Screen: Sign Up — Service Provider (Step 1 of 3: Personal Info)
- Progress indicator: Step 1 / 3
- Title: "Personal Information"
- Full Name, Phone, Email inputs
- Password + Confirm Password
- Profile photo upload (circular avatar with camera icon)
- CTA: "Next"

#### Screen: Sign Up — Service Provider (Step 2 of 3: Professional Info)
- Progress indicator: Step 2 / 3
- Title: "Professional Details"
- Service Category dropdown (Electrician, Plumber, AC Repair, Carpenter, etc.)
- Years of experience input
- Service area: city + coverage radius selector (5 / 15 / 25 km toggle)
- Portfolio images upload (grid, up to 6 images)
- Description / Bio textarea
- CTA: "Next"

#### Screen: Sign Up — Service Provider (Step 3 of 3: Verification)
- Progress indicator: Step 3 / 3
- Title: "Verify Your Identity"
- CNIC number input with masked format (XXXXX-XXXXXXX-X)
- CNIC front photo upload
- CNIC back photo upload
- Optional: Police verification certificate upload
- Optional: Trade license / certificate upload
- Info banner: "Verification takes 24–48 hours. You'll be notified via SMS."
- CTA: "Submit for Verification"

#### Screen: OTP Verification
- Title: "Enter Verification Code"
- Subtitle: "We sent a 6-digit code to +92 XXX XXXXXXX"
- 6 OTP input boxes (auto-advance)
- Countdown timer: "Resend in 00:59"
- Resend Code link (active after timer)
- CTA: "Verify"

#### Screen: Forgot Password
- Title: "Reset Password"
- Phone number input
- CTA: "Send Code"
- After OTP: new password + confirm password fields

---

### 3.2 Customer Screens (Mobile + Web)

#### Screen: Home / Discovery
- **Top Bar**: Location pin + current area name (tappable to change) | Notification bell with badge
- **Search Bar**: "Search for a service..." with mic icon
- **Emergency Banner** (optional, contextual): "Need urgent help? Book Now" with lightning icon
- **Service Categories Grid**: 2×4 grid (mobile) / horizontal scroll cards (web)
  - Each category: circular icon + label (Electrician, Plumber, AC Repair, Carpenter, Cleaning, Painter, Mobile Repair, Appliance Repair)
- **Section: Nearby Top-Rated Providers**
  - Horizontal scroll cards
  - Each card: provider photo, name, category, star rating, review count, distance, badge tier chip, "Book Now" button
- **Section: How It Works** (shown to new users only)
  - 3 steps: Search → Book → Done
- **Section: Recent Bookings** (returning users)
  - Compact card list of last 2 bookings with quick "Book Again" action
- **Bottom Tab Bar**

#### Screen: Search & Filter
- **Search Bar** (focused, with back button)
- **Filter Chips Row**: All | Available Now | Top Rated | Verified | Nearby
- **Advanced Filter Sheet** (slide-up):
  - Service category multi-select
  - Rating filter (3+ / 4+ / 4.5+)
  - Distance slider (1 km – 25 km)
  - Price range slider
  - Availability: Today / This Week / Any
  - Sort: Relevance / Nearest / Highest Rated / Lowest Price
- **Results List**:
  - Each item: provider avatar, name, category, badge, rating, reviews count, distance, hourly rate, "View Profile" button
  - Map toggle button (top-right) to switch between list and map view
- **Map View**: Full-screen Google Map with provider pins, floating filter bar at top, list sheet that slides up from bottom

#### Screen: Service Provider Profile
- **Header**: Cover photo / banner area
- **Provider Info Section**:
  - Circular avatar (large)
  - Name + badge tier chip (Bronze / Silver / Gold)
  - Category + experience years
  - Star rating (numeric + filled stars) + "(N reviews)"
  - Verified badge icons row: CNIC verified, Phone verified, Background check
  - Distance from customer
- **Action Buttons Row**: Chat | Call | Share
- **Stats Bar**: Completed Jobs | Response Rate | Avg Response Time
- **About / Bio Section**: expandable text
- **Services Offered**: card list with service name + price (hourly or fixed)
- **Portfolio Gallery**: 2-column grid of past work photos (tappable to expand)
- **Availability Calendar**: weekly view, green = available slots
- **Customer Reviews Section**:
  - Rating breakdown bar chart (5★ to 1★)
  - Individual review cards: avatar, name, date, rating, comment
- **Floating CTA**: "Book Now" button (sticky at bottom)

#### Screen: Booking & Scheduling
- **Header**: "Book [Provider Name]"
- Selected service type (from provider's offerings)
- **Date Picker**: horizontal scroll of upcoming 7 days
- **Time Slot Picker**: grid of available time slots (09:00, 10:00… etc.)
- **Job Description**: textarea "Describe your issue..."
- **Address Section**: current location (auto-filled) + edit option + add note
- **Price Estimate Card**: service type + base rate + estimated total range
- **Summary Card**: Provider photo + name + date/time + service + estimated cost
- **CTA**: "Confirm Booking" button

#### Screen: Price Estimation
- Service category icon + name
- Input: describe the problem (dropdown + free text)
- Output card:
  - Estimated time range
  - Cost breakdown (labor + parts estimate)
  - Note: "Final price may vary. You approve before payment."
- CTA: "Proceed to Book"

#### Screen: Booking Confirmation
- Large success checkmark animation
- "Booking Confirmed!"
- Booking ID
- Provider details card (photo, name, ETA)
- Job summary (service, date/time, address)
- Action buttons: Track Provider | Chat | Cancel Booking
- Share booking button

#### Screen: Live Tracking
- Full-screen map
- Provider's real-time location as a moving pin (vehicle/person icon)
- Customer's location pin
- Route line between them
- ETA chip at top: "Ahmed arrives in ~12 min"
- Bottom sheet (compact):
  - Provider photo + name + rating
  - Distance remaining
  - Call | Chat buttons
- SOS button (bottom-right, red)

#### Screen: Payment
- Header: "Payment"
- Order Summary card: service, provider, duration, subtotal
- Payment Method selector:
  - JazzCash (with logo)
  - EasyPaisa (with logo)
  - Debit / Credit Card
  - Cash on Completion
- Add card form (conditional, if card selected): card number, expiry, CVV
- Promo code input + Apply
- Total amount breakdown: subtotal + platform fee + discount = Total
- CTA: "Pay [Amount]" or "Confirm Cash Payment"
- Escrow info banner: "Payment is held securely until job is complete"

#### Screen: Payment Success
- Animated checkmark / confetti
- "Payment Successful!"
- Transaction ID
- Amount paid
- Receipt action buttons: View Receipt | Download

#### Screen: In-App Chat
- **Header**: Provider avatar + name + online status indicator + Call button
- **Chat Bubbles**: standard messenger style, timestamps
- **Message Input Bar**: text field + attachment icon (photo) + send button
- Safety banner (first message): "All messages are monitored for your safety"
- Quick-reply chips: "On my way", "15 min late", "Job complete"

#### Screen: Review & Rating
- Title: "How was your experience?"
- Provider photo + name
- 5-star rating selector (large interactive stars)
- Category tags (quick select): Professional | On Time | Good Work | Friendly
- Written review textarea (optional)
- Photo upload (optional, up to 3)
- CTA: "Submit Review"

#### Screen: Bookings (History & Active)
- **Tab Bar**: Active | Upcoming | Past
- Each booking card:
  - Provider avatar + name + service type
  - Date + time + status chip (In Progress / Scheduled / Completed / Cancelled)
  - Action buttons per status:
    - Active: Track | Chat
    - Upcoming: Reschedule | Cancel
    - Past: Book Again | View Receipt | Leave Review

#### Screen: Customer Profile
- Avatar (tappable to change) + Name + Phone
- Account Info section: edit name, email, phone
- Saved Addresses: list with add/edit/delete
- Payment Methods: list of saved methods + add new
- Notification Preferences: toggles per type
- Language: English / Urdu toggle
- Support: Help Center | Contact Us | Report Issue
- Logout button

#### Screen: Notifications
- List of notifications grouped by "Today" / "This Week"
- Each item: icon (colored by type) + message + timestamp
- Types: booking confirmed, provider on way, payment received, review reminder, promo

---

### 3.3 Service Provider Screens (Mobile-First)

#### Screen: Provider Home / Dashboard
- **Top Bar**: Location | Notification bell | Menu
- **Online/Offline Toggle**: large pill toggle (Green = Online, Grey = Offline)
- Status banner when online: "You are visible to customers"
- **Today's Summary Cards Row**:
  - Jobs Today | Earnings Today | Avg Rating
- **Incoming Job Request Card** (real-time alert overlay):
  - Customer name + address + service needed + distance
  - Estimated earnings
  - Accept / Reject buttons (with countdown timer 30s)
- **Active Job Card** (if job in progress):
  - Customer name + address + job type
  - Navigation button | Chat button | Mark Complete button
- **Recent Activity List**: last 3–5 completed jobs

#### Screen: Job Request Detail
- Customer avatar + name + rating (as a customer)
- Service requested + description of issue
- Address with map preview
- Estimated distance + travel time
- Proposed schedule (date/time)
- Estimated earnings (after commission breakdown shown)
- Accept | Reject buttons (full width)
- "View More Requests" link

#### Screen: Active Job
- Job status progress bar: Accepted → Travelling → Arrived → In Progress → Completed
- Customer info: name, address, phone (tap to call)
- Navigation button (opens Google Maps)
- Chat button
- Job notes / description
- "I've Arrived" button (changes status)
- "Mark Job Complete" button (with confirmation dialog)
- Photo upload: attach after-job photos

#### Screen: Earnings Dashboard
- **Header**: Total Earnings (this month) — large number
- **Period Selector**: Today | This Week | This Month | Custom
- **Earnings Chart**: bar chart by day/week
- **Summary Cards**: Gross Earnings | Commission Deducted | Net Earnings
- **Recent Transactions List**:
  - Each item: customer name, service, date, gross amount, commission, net amount
- **Payout Section**: Available balance + "Request Payout" button
- Commission info tooltip: "Platform fee: 10–15% based on your tier"

#### Screen: Provider Profile Edit
- Profile photo (editable)
- Personal info fields: name, phone, email
- Bio / About Me textarea
- Services Offered: add/remove/edit list (service name + price type + amount)
- Portfolio: image grid with add/delete
- Certifications: upload list
- Service Area: city + radius selector
- CNIC / verification documents (view-only with re-submit option)
- Save button

#### Screen: Availability Management
- Weekly calendar grid (Mon–Sun, time slots)
- Toggle individual slots: available / unavailable
- Recurring schedule option: "Same every week" toggle
- Vacation mode: set date range to pause all bookings

#### Screen: Badge & Tier Status
- Current tier display (Bronze / Silver / Gold) with badge graphic
- Progress bar to next tier
- Requirements for next tier: checklist (jobs completed, rating, complaints)
- Benefits of current tier: list
- Benefits unlocked at next tier: locked list (greyed out)
- "How to improve" tips section

---

### 3.4 Admin Panel (Web — Desktop-First, Responsive)

#### Screen: Admin Login
- Clean centered card on dark background
- Logo + "Admin Portal"
- Email + Password inputs
- 2FA code input (step 2)
- Login button

#### Screen: Admin Dashboard (Overview)
- **Top Header Bar**: Logo | Admin name + avatar | Notifications | Logout
- **Left Sidebar**: navigation links (Dashboard, Providers, Customers, Bookings, Payments, Reports, Settings)
- **KPI Cards Row** (4 cards):
  - Total Active Bookings (today)
  - New Provider Applications (pending)
  - Total Revenue (this month)
  - Active Users (online now)
- **Charts Section**:
  - Bookings Over Time: line chart (7/30/90 days)
  - Revenue by Category: pie/donut chart
  - Geographic Heatmap: Google Maps heatmap of service density
- **Recent Activity Feed**: live list of bookings, signups, payments
- **Alerts**: fraud flags, pending approvals count

#### Screen: Provider Applications (Approve / Reject)
- **Table**: columns — Name, Category, Submitted Date, CNIC Status, Documents, Status, Actions
- Row expandable: shows CNIC images, certificates, portfolio
- Bulk select + Approve / Reject actions
- Filter: Pending | Approved | Rejected | Flagged
- Search by name / phone
- Individual provider detail panel (side-drawer or modal):
  - Full profile view
  - Document viewer
  - Notes field for admin
  - Approve | Reject | Request More Info buttons

#### Screen: User Management
- **Tabs**: Customers | Providers
- Searchable, sortable table
- Customer columns: Name, Phone, Bookings Count, Total Spent, Join Date, Status
- Provider columns: Name, Category, Tier, Rating, Jobs Done, Earnings, Status
- Row actions: View Profile | Suspend | Ban | Reset Password
- Suspend modal: reason input + duration selector

#### Screen: Bookings Management
- Table: Booking ID, Customer, Provider, Service, Date, Amount, Status, Actions
- Filter by: date range, service category, status (all/active/completed/disputed/cancelled)
- Row action: View Details | Assign Different Provider | Process Refund | Mark Resolved
- Booking detail modal: full timeline, chat history, payment breakdown, dispute notes

#### Screen: Payments & Commission
- **Summary Cards**: Total Processed | Pending Payouts | Commission Earned
- **Transactions Table**: ID, Provider/Customer, Type, Amount, Fee, Net, Date, Status
- **Payout Queue**: providers with pending balance, Approve Payout button
- **Commission Settings Panel**: set rates per tier (Bronze / Silver / Gold)

#### Screen: Analytics & Reports
- Date range selector
- **Charts**:
  - Daily/weekly/monthly bookings trend
  - Revenue trend
  - Top services by bookings
  - Top providers by revenue
  - Customer acquisition trend
  - Geographic service distribution (heatmap)
- Export: CSV / PDF report button

#### Screen: Fraud Detection
- Flagged accounts list with reason tags (multiple bookings cancelled, suspicious payment, fake reviews)
- Risk score per account
- Action: Investigate | Suspend | Clear Flag

---

## 4. Key UI Components (Reusable)

### Provider Card (Compact)
- Avatar (60px circle) | Name | Category | Badge chip | ★ Rating | Distance | "Book" button

### Provider Card (Large / Featured)
- Banner image | Avatar overlay | Name + Badge | Rating + Reviews | Services offered chips | Book Now CTA

### Booking Status Card
- Service icon | Provider name | Date + Time | Status chip (color-coded) | Quick action button

### Rating Stars Component
- 5 stars, filled/half/empty states
- Interactive (input) or display-only modes

### Badge Chip
- Bronze (brown) | Silver (grey) | Gold (yellow) — pill shape with tier icon

### Verification Badge Row
- Small icon + label: CNIC ✓ | Phone ✓ | Background Check ✓

### Category Icon Card
- Circular background (light primary color) | Icon | Label below

### Online/Offline Toggle (Provider)
- Large pill: green glow when online, grey when offline
- Smooth animated transition

### SOS Button
- Red circular floating button, bottom-right, with shield/phone icon
- Haptic feedback on press

### Escrow Info Banner
- Blue info card: lock icon + "Your payment is secure" text

### Empty State Illustrations
- No results found (search)
- No bookings yet
- No notifications
- Offline state

### Loading States
- Skeleton screens (card placeholders with shimmer animation) for all list/card views

### Toast / Snackbar Notifications
- Success (green) | Error (red) | Info (blue)
- Slide-up from bottom, auto-dismiss 3s

---

## 5. User Flows Summary

### Customer Flow
Splash → Onboarding → Sign Up / Login → OTP Verify → Home → Search/Browse → Provider Profile → Book → Schedule & Address → Price Estimate → Confirm Booking → Live Tracking → In-App Chat → Job Complete → Payment → Review

### Provider Flow
Splash → Sign Up (3 steps) → Submit Verification → Wait for Approval → Login → Dashboard → Toggle Online → Receive Job Request → Accept/Reject → Navigate to Customer → Complete Job → Receive Payment → View Earnings

### Admin Flow
Admin Login → 2FA → Dashboard Overview → Review Provider Applications → Approve/Reject → Monitor Bookings → Handle Disputes → Process Payouts → View Analytics

---

## 6. Responsive / Platform Notes

| Element | Mobile (App) | Web |
|---|---|---|
| Navigation | Bottom tab bar | Top navbar + sidebar (admin) |
| Cards | Full-width scroll | Grid layout (3–4 cols) |
| Map | Full screen with slide sheet | Split view (map left, list right) |
| Booking flow | Step-by-step screens | Single-page with sections |
| Admin panel | Not applicable | Desktop-first, responsive |
| Language toggle | In settings + onboarding | Header dropdown |
| Provider availability | Inline toggle on dashboard | Dedicated calendar page |

---

## 7. Localization Notes
- Support Right-to-Left (RTL) layout for Urdu
- All currency in PKR (₨ symbol)
- Phone numbers: Pakistan format (+92 / 0300 style)
- Date format: DD/MM/YYYY
- Maps: Google Maps with Pakistan region default
