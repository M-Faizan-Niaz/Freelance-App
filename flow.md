---

Phase 0 — Seed & Setup

Before testing, make sure the DB is seeded (lookup tables must exist):

pnpm db:setup

This seeds: tiers, roles, booking statuses, payment methods, payment statuses, service categories, commission settings, countries, cities.

---

Phase 1 — Authentication

All sessions are cookie-based (Better-Auth). Your HTTP client must send cookies on every subsequent request.

1.1 Register as Admin

POST /v1/api/auth/sign-up/email
Content-Type: application/json

{
"email": "admin@test.com",
"password": "Admin@12345",
"name": "Platform Admin"
}

▎ Note the user id from the response — you'll need it for admin actions.

1.2 Register as Service Provider

POST /v1/api/auth/sign-up/email
Content-Type: application/json

{
"email": "provider@test.com",
"password": "Provider@12345",
"name": "Ali Hassan"
}

▎ Internally calls the registerProvider hook — creates a service_providers record automatically.

1.3 Register as Customer

POST /v1/api/auth/sign-up/email
Content-Type: application/json

{
"email": "customer@test.com",
"password": "Customer@12345",
"name": "Sara Khan"
}

▎ Internally calls the registerCustomer hook — creates a customers record.

1.4 Sign In (repeat for each role in separate sessions/tabs)

POST /v1/api/auth/sign-in/email
Content-Type: application/json

{
"email": "customer@test.com",
"password": "Customer@12345"
}

Expected: 200 with Set-Cookie header. All subsequent requests must include this cookie.

1.5 Verify session is live

GET /v1/api/auth/get-session

Expected: 200 with your user object.

---

Phase 2 — User Profile

▎ Sign in as any user first.

2.1 Get own profile

GET /v1/api/users/me

2.2 Update name & phone

PATCH /v1/api/users/me
Content-Type: application/json

{
"name": "Sara Khan Updated",
"phoneNumber": "+923001234567"
}

2.3 Upload profile photo

PATCH /v1/api/users/me/profile-photo
Content-Type: multipart/form-data

photo: [attach any .jpg/.png, max 5 MB]

Expected: 200 with updated profilePhotoUrl in response.

---

Phase 3 — Service Categories (Admin)

▎ Sign in as admin for all steps in this phase.

3.1 Create a service category

POST /v1/api/service-categories
Content-Type: application/json

{
"name": "Plumbing",
"description": "All plumbing services",
"isActive": true
}

▎ Save the returned id → call it CATEGORY_ID.

3.2 Upload category image

PATCH /v1/api/service-categories/{CATEGORY_ID}/image
Content-Type: multipart/form-data

image: [attach any image file]

3.3 List all categories (public — no auth needed)

GET /v1/api/service-categories

3.4 Update a category

PATCH /v1/api/service-categories/{CATEGORY_ID}
Content-Type: application/json

{
"name": "Plumbing & Pipes"
}

3.5 Soft-delete categories

DELETE /v1/api/service-categories
Content-Type: application/json

{
"ids": [CATEGORY_ID]
}

Expected: 204 No Content.

---

Phase 4 — Service Provider Setup

▎ Sign in as provider.

4.1 Upload CNIC verification documents

POST /v1/api/service-providers/me/documents
Content-Type: multipart/form-data

cnicFront: [attach image/pdf, max 10 MB]
cnicBack: [attach image/pdf, max 10 MB]

Expected: 200 with { cnicFrontUrl, cnicBackUrl }.

4.2 Upload portfolio images

POST /v1/api/service-providers/me/portfolio
Content-Type: multipart/form-data

images: [attach 1–3 image files]
images: [you can attach multiple with the same field name]

Expected: 200 with { uploaded: [...], failed: [] }.

4.3 List portfolio (public)

▎ No auth needed. Use the numeric SP ID from the admin view or from sign-up response.

GET /v1/api/service-providers/{SP_ID}/portfolio

4.4 Delete a portfolio image

▎ Grab a fileName from the upload response.

DELETE /v1/api/service-providers/me/portfolio
Content-Type: application/json

{
"fileNames": ["sp-portfolio/abc123.jpg"]
}

---

Phase 5 — Admin: Verify Provider

▎ Sign in as admin.

5.1 List all providers (filter by status)

GET /v1/api/admin/providers?status=pending

▎ Note the provider's numeric id → call it PROVIDER_ID.

5.2 Get full provider detail (check CNIC URLs are there)

GET /v1/api/admin/providers/{PROVIDER_ID}

5.3 Approve the provider

PATCH /v1/api/admin/providers/{PROVIDER_ID}/verify
Content-Type: application/json

{
"action": "approve",
"note": "Documents verified"
}

Expected: verificationStatus: "approved", isCnicVerified: true.

5.4 Test rejection flow (optional)

PATCH /v1/api/admin/providers/{PROVIDER_ID}/verify
Content-Type: application/json

{
"action": "reject",
"note": "CNIC image is blurry"
}

---

Phase 6 — Customer Setup

▎ Sign in as customer.

6.1 Get customer profile

GET /v1/api/customers/me

6.2 Add a saved address

POST /v1/api/customers/me/addresses
Content-Type: application/json

{
"label": "Home",
"addressText": "House 12, Street 5, Gulshan-e-Iqbal, Karachi",
"latitude": 24.9056,
"longitude": 67.0822,
"isDefault": true
}

▎ Save the returned id → ADDRESS_ID.

6.3 List addresses

GET /v1/api/customers/me/addresses

6.4 Update address

PATCH /v1/api/customers/me/addresses/{ADDRESS_ID}
Content-Type: application/json

{
"label": "Main Home"
}

6.5 Set default address

PATCH /v1/api/customers/me/addresses/{ADDRESS_ID}/default

6.6 Delete address

DELETE /v1/api/customers/me/addresses/{ADDRESS_ID}

Expected: 204 No Content.

---

Phase 7 — Bookings (Core Flow)

This is the main business flow. You need customer session for creating, provider session for status updates.

7.1 Customer — Create a booking

▎ Sign in as customer. You need: PROVIDER_ID (numeric SP id), CATEGORY_ID.

POST /v1/api/bookings
Content-Type: application/json

{
"providerId": 1,
"categoryId": 1,
"scheduledAt": "2026-06-01T10:00:00.000Z",
"customerAddress": "House 12, Street 5, Gulshan-e-Iqbal, Karachi",
"customerLatitude": 24.9056,
"customerLongitude": 67.0822,
"description": "Need kitchen sink fixed",
"estimatedPrice": 2500
}

▎ Save returned id → BOOKING_ID. Status will be pending.

7.2 Customer — List own bookings

GET /v1/api/bookings?role=customer&page=1&limit=10

7.3 Customer — Get booking detail

GET /v1/api/bookings/{BOOKING_ID}

7.4 Customer — Reschedule (only works in pending status)

PATCH /v1/api/bookings/{BOOKING_ID}/reschedule
Content-Type: application/json

{
"scheduledAt": "2026-06-02T14:00:00.000Z"
}

7.5 Provider — Accept the booking

▎ Switch to provider session.

PATCH /v1/api/bookings/{BOOKING_ID}/status
Content-Type: application/json

{ "status": "accepted" }

7.6 Provider — Progress through status chain

Run each step in order, one at a time:

PATCH /v1/api/bookings/{BOOKING_ID}/status
{ "status": "travelling" }

PATCH /v1/api/bookings/{BOOKING_ID}/status
{ "status": "arrived" }

PATCH /v1/api/bookings/{BOOKING_ID}/status
{ "status": "in_progress" }

7.7 Provider — Upload completion photos (status must be in_progress or completed)

POST /v1/api/bookings/{BOOKING_ID}/complete-photo
Content-Type: multipart/form-data

images: [attach 1–2 images, max 5 MB each]

Expected: { uploaded: [...], failed: [] }.

7.8 Provider — Mark completed

PATCH /v1/api/bookings/{BOOKING_ID}/status
{ "status": "completed" }

7.9 Test cancellation (optional — use a fresh booking)

▎ Both customer and provider can cancel from pending, accepted, or travelling.

POST /v1/api/bookings/{BOOKING_ID}/cancel
Content-Type: application/json

{ "reason": "Customer not available at the address" }

---

Phase 8 — Payments

▎ Booking must be in completed status. Sign in as customer.

8.1 Submit payment with proof

POST /v1/api/payments
Content-Type: multipart/form-data

bookingId: {BOOKING_ID}
amount: 2500
paymentMethodId: 1
transactionReference: TXN-123456
notes: Paid via JazzCash
proofImage: [attach screenshot of payment, max 10 MB]

▎ Save returned id → PAYMENT_ID. Status will be pending.

8.2 Get payment by booking

GET /v1/api/payments/booking/{BOOKING_ID}

8.3 Get payment by ID

GET /v1/api/payments/{PAYMENT_ID}

8.4 List own payments

GET /v1/api/payments?page=1&limit=10

8.5 Admin — Approve payment

▎ Switch to admin session.

PATCH /v1/api/payments/{PAYMENT_ID}/approve

Expected: paymentStatusName: "completed", reviewedBy set.

8.6 Admin — Reject payment (use a fresh payment to test)

PATCH /v1/api/payments/{PAYMENT_ID}/reject
Content-Type: application/json

{ "rejectionReason": "Transaction reference not found in our records" }

---

Phase 9 — Reviews

▎ Booking must be completed. Sign in as customer.

9.1 Create a review

POST /v1/api/reviews
Content-Type: application/json

{
"bookingId": {BOOKING_ID},
"rating": 5,
"comment": "Excellent work, very professional and on time!"
}

Expected: Review created. Provider's averageRating is recalculated automatically.

9.2 Verify duplicate prevention

Attempt the same request again.
Expected: 409 Conflict — "A review already exists for this booking".

9.3 List provider reviews (public)

GET /v1/api/reviews/provider/{PROVIDER_ID}?page=1&limit=10&sortOrder=desc

---

Phase 10 — Chat

▎ Sign in as customer.

10.1 Start a conversation with a provider

POST /v1/api/conversations
Content-Type: application/json

{
"providerId": {PROVIDER_ID},
"bookingId": {BOOKING_ID}
}

▎ Save returned id → CONVERSATION_ID.

10.2 Send a message

POST /v1/api/conversations/{CONVERSATION_ID}/messages
Content-Type: application/json

{
"content": "Hi, will you be on time tomorrow?"
}

10.3 Provider — Reply

▎ Switch to provider session.

POST /v1/api/conversations/{CONVERSATION_ID}/messages
Content-Type: application/json

{
"content": "Yes, I'll be there by 10 AM"
}

10.4 List messages (marks as read automatically)

GET /v1/api/conversations/{CONVERSATION_ID}/messages?page=1&limit=20

10.5 List all conversations

GET /v1/api/conversations?page=1&limit=10

---

Phase 11 — Notifications

11.1 List notifications

GET /v1/api/notifications?page=1&limit=20

11.2 Mark specific notifications as read

▎ Get notification IDs from the list response.

PATCH /v1/api/notifications/read
Content-Type: application/json

{ "ids": [1, 2, 3] }

11.3 Mark all as read

PATCH /v1/api/notifications/read-all

---

Phase 12 — Admin Operations

▎ Sign in as admin for all steps.

12.1 Dashboard KPIs

GET /v1/api/admin/dashboard

Expected: activeBookings, pendingProviders, totalRevenue, onlineProviders.

12.2 List all customers

GET /v1/api/admin/customers?page=1&limit=20
GET /v1/api/admin/customers?search=sara

12.3 Suspend a user

▎ Use the UUID id from sign-up or admin/customers list.

PATCH /v1/api/admin/users/{USER_UUID}/suspend
Content-Type: application/json

{
"reason": "Suspicious activity reported",
"durationDays": 7
}

12.4 Unsuspend a user

PATCH /v1/api/admin/users/{USER_UUID}/unsuspend

12.5 Ban a user permanently

PATCH /v1/api/admin/users/{USER_UUID}/ban
Content-Type: application/json

{ "reason": "Repeated fraud attempts" }

12.6 List all bookings (admin view)

GET /v1/api/admin/bookings?page=1&limit=20
GET /v1/api/admin/bookings?statusId=1&dateFrom=2026-01-01&dateTo=2026-12-31

12.7 Reassign a booking to another provider

PATCH /v1/api/admin/bookings/{BOOKING_ID}/assign
Content-Type: application/json

{ "providerId": {OTHER_PROVIDER_ID} }

12.8 Refund a booking

▎ Booking must have a payment. Payment + booking both get updated.

POST /v1/api/admin/bookings/{BOOKING_ID}/refund

Expected: { bookingId, paymentId, refunded: true }.

12.9 Admin payments view

GET /v1/api/admin/payments?page=1&limit=20
GET /v1/api/admin/payments?statusId=1

12.10 Payout requests

GET /v1/api/admin/payouts?page=1&limit=20
POST /v1/api/admin/payouts/{PAYOUT_ID}/approve

12.11 Fraud flags

GET /v1/api/admin/fraud-flags?page=1&limit=20
PATCH /v1/api/admin/fraud-flags/{FLAG_ID}
Content-Type: application/json

{ "action": "clear" } ← or "suspend" / "investigate"

12.12 Commission settings

GET /v1/api/admin/commission-settings

PATCH /v1/api/admin/commission-settings
Content-Type: application/json

{
"settings": [
{ "tierId": 1, "commissionRate": "12.50" },
{ "tierId": 2, "commissionRate": "10.00" }
]
}

12.13 Analytics

GET /v1/api/admin/analytics?period=day
GET /v1/api/admin/analytics?period=week
GET /v1/api/admin/analytics?period=month

---

Status Transition Cheatsheet

BOOKING:
pending → accepted | rejected
accepted → travelling
travelling → arrived
arrived → in_progress
in_progress → completed
pending | accepted | travelling → cancelled (either party)

PAYMENT:
pending → completed (admin approve)
pending → failed (admin reject)
completed → refunded (admin refund booking)

Common Errors to Expect

┌───────────────────────────────┬─────────────────────────────┐
│ Scenario │ Expected │
├───────────────────────────────┼─────────────────────────────┤
│ Wrong status transition │ 400 invalid_transition │
├───────────────────────────────┼─────────────────────────────┤
│ Booking not yours │ 403 Access denied │
├───────────────────────────────┼─────────────────────────────┤
│ Duplicate review │ 409 Conflict │
├───────────────────────────────┼─────────────────────────────┤
│ Duplicate payment │ 409 Conflict │
├───────────────────────────────┼─────────────────────────────┤
│ No files attached │ 400 Missing required field │
├───────────────────────────────┼─────────────────────────────┤
│ Missing cookie │ 401 Authentication required │
├───────────────────────────────┼─────────────────────────────┤
│ Non-admin hitting admin route │ 403 Forbidden │
└───────────────────────────────┴─────────────────────────────┘
