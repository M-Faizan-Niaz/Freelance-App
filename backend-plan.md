 Service Marketplace App — Backend Development Plan

 Context

 Building the backend for a Pakistan-based service marketplace (Careem/Uber-for-services model) on top of an existing monorepo. The stack is Hono.js +
 Drizzle ORM + PostgreSQL + Better Auth, and the codebase already has a working colors module as the canonical pattern to follow. The user wants to start
 by normalizing and completing the DBML, then implement all backend APIs module by module.

 ---
 Phase 1: DBML Finalization (Normalized)

 File: database/database.dbml — rewrite/extend in place

 Issues in Current DBML to Fix

 ┌────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                      Problem                       │                                              Fix                                               │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ users.id is int, but Better Auth uses text (UUID)  │ Replace int PKs on user-linked tables with text; keep serial for lookup tables                 │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ users table has password_hash — Better Auth        │ Remove from DBML; Better Auth owns the users table                                             │
 │ handles this                                       │                                                                                                │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ service_providers.tier — ambiguous column name     │ Rename to tier_id                                                                              │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ No roles / user_profiles split                     │ Add user_profiles for marketplace-specific user fields                                         │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: saved_addresses                           │ Add                                                                                            │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: conversations + messages                  │ Add (in-app chat from spec)                                                                    │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: notifications                             │ Add                                                                                            │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: payout_requests                           │ Add                                                                                            │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: disputes                                  │ Add (admin dispute management from spec)                                                       │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: commission_settings                       │ Add (per-tier rates from admin spec)                                                           │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Missing: provider_documents                        │ Extract CNIC + certs into separate table                                                       │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ availability_slots missing timestamps              │ Add created_at, updated_at                                                                     │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ bookings has redundant price fields                │ Normalize: keep estimated_price, final_price, commission_rate, commission_amount; derive       │
 │                                                    │ total_price in query                                                                           │
 ├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ fraud_flags not present                            │ Add                                                                                            │
 └────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘

 Complete Normalized Table List

 Owned by Better Auth (do not redefine in Drizzle):
 - users — id (text UUID), name, email, emailVerified, image, createdAt, updatedAt
 - sessions, accounts, verifications, twoFactors

 Lookup / Reference Tables (serial int PK, seeded):
 tiers                    Basic | Standard | Premium
 roles                    customer | service_provider | admin
 service_categories       Electrician | Plumber | AC Repair | ...
 booking_statuses         pending | accepted | travelling | arrived | in_progress | completed | cancelled | disputed
 customer_statuses        active | blocked | pending_verification
 payment_methods          jazzcash | easypaisa | card | cash
 payment_statuses         pending | held | completed | refunded | failed
 action_types             suspend | ban | unsuspend | approve_provider | reject_provider | flag_fraud
 dispute_statuses         open | under_review | resolved | closed
 payout_statuses          requested | approved | processing | completed | failed
 notification_types       booking_confirmed | provider_on_way | payment_received | review_reminder | promo | system
 message_types            text | image | quick_reply

 Core Entity Tables:
 user_profiles            user_id (text FK → users.id), role_id, full_name, phone_number,
                          phone_verified, profile_photo_url, is_active, created_by, updated_by

 service_providers        id (serial), user_id (text FK), cnic_number, is_cnic_verified,
                          hourly_rate, tier_id (FK → tiers), is_online, total_jobs_completed,
                          average_rating, bio, coverage_radius_km, city

 customers                id (serial), user_id (text FK), customer_status_id (FK), total_bookings,
                          total_spent

 provider_documents       id (serial), provider_id (FK), document_type (enum: cnic_front,
                          cnic_back, police_cert, trade_license), document_url, is_verified,
                          verified_by (text FK → users.id), verified_at

 provider_services        id (serial), provider_id (FK), category_id (FK), description,
                          experience_years, price_type (hourly | fixed), price

 availability_slots       id (serial), provider_id (FK), day_of_week (0–6), start_time,
                          end_time, created_at, updated_at

 portfolio_images         id (serial), provider_id (FK), image_url, caption

 saved_addresses          id (serial), customer_id (FK), label, address_text, latitude,
                          longitude, is_default

 bookings                 id (serial), customer_id (FK → customers), provider_id (FK),
                          category_id (FK), scheduled_at, completed_at, customer_latitude,
                          customer_longitude, customer_address, description, estimated_price,
                          final_price, commission_rate, commission_amount, status_id (FK),
                          cancelled_by (text FK), cancellation_reason

 payments                 id (serial), booking_id (FK), amount, commission_amount,
                          provider_payout, payment_method_id (FK), payment_status_id (FK),
                          transaction_id (unique), gateway_reference, paid_at

 payout_requests          id (serial), provider_id (FK), amount, payout_status_id (FK),
                          requested_at, processed_at, processed_by (text FK)

 reviews                  id (serial), booking_id (FK, unique — one review per booking),
                          reviewer_id (text FK), reviewee_id (text FK), rating (1–5),
                          comment, is_deleted

 commission_settings      id (serial), tier_id (FK, unique), commission_rate (decimal),
                          effective_from, created_by (text FK)

 conversations            id (serial), customer_id (FK → customers), provider_id (FK),
                          booking_id (FK, nullable), last_message_at

 messages                 id (serial), conversation_id (FK), sender_id (text FK → users.id),
                          content, message_type_id (FK), is_read, read_at, is_deleted

 notifications            id (serial), user_id (text FK), notification_type_id (FK), title,
                          body, data (json), is_read, read_at, created_at

 disputes                 id (serial), booking_id (FK), raised_by (text FK), reason,
                          dispute_status_id (FK), resolved_by (text FK), resolution_note,
                          created_at, resolved_at

 fraud_flags              id (serial), user_id (text FK), reason, risk_score (0–100),
                          flagged_by_system (bool), flagged_by_admin (text FK),
                          is_resolved, resolved_at, created_at

 admin_actions            id (serial), admin_id (text FK), action_type_id (FK),
                          target_user_id (text FK), reason, metadata (json), created_at

 countries                id (serial), name, code
 cities                   id (serial), country_id (FK), name, latitude, longitude

 ---
 Phase 2: Drizzle Schema Implementation

 Directory: packages/api/src/db/models/

 Create one *.model.ts per domain group, following the exact pattern of colors.model.ts:
 - Use pgTable with snake_case column names (Drizzle config already sets casing: 'snake_case')
 - Export selectSchema, insertSchema, and Type / NewType for each table
 - Register every table in packages/api/src/db/tables.ts

 File mapping:
 user-profiles.model.ts         → user_profiles
 service-providers.model.ts     → service_providers, provider_services, provider_documents,
                                   portfolio_images, availability_slots
 customers.model.ts             → customers, saved_addresses
 bookings.model.ts              → bookings
 payments.model.ts              → payments, payout_requests
 reviews.model.ts               → reviews
 conversations.model.ts         → conversations, messages
 notifications.model.ts         → notifications
 admin.model.ts                 → commission_settings, disputes, fraud_flags, admin_actions

 lookups.model.ts               → tiers, roles, service_categories, booking_statuses,
                                   customer_statuses, payment_methods, payment_statuses,
                                   action_types, dispute_statuses, payout_statuses,
                                   notification_types, message_types

 After creating models, run:
 pnpm db:generate   # generate migration SQL
 pnpm db:migrate    # apply to DB

 ---
 Phase 3: API Modules (Build Order)

 Each module follows the exact colors pattern:

 src/modules/{module}/
 ├── {module}.schema.ts      Zod request/response schemas
 ├── {module}.route.ts       Hono OpenAPI route definitions
 ├── {module}.handler.ts     Thin controllers
 ├── {module}.service.ts     Business logic
 ├── {module}.repository.ts  Drizzle queries
 ├── {module}.index.ts       Router aggregation
 ├── {module}.constants.ts   Enums, messages
 └── {module}.seed.ts        Seed data (for lookup tables)

 Register each router in packages/api/src/app.ts under /v1.

 ---
 Module 1 — Lookup Data Seeds

 Path: packages/api/src/db/seeds/

 Seed all lookup tables: tiers, roles, service_categories, booking_statuses, customer_statuses, payment_methods, payment_statuses, action_types,
 dispute_statuses, payout_statuses, notification_types, message_types, commission_settings (default rates per tier).

 No API endpoints needed — admin-managed via direct seeding / future settings API.

 ---
 Module 2 — Auth Extension (modules/users/auth/)

 Existing: Better Auth already handles /v1/api/auth/* routes.

 Extend with custom registration flow:
 POST  /v1/api/auth/register/customer      validates role, creates user_profiles + customers row
 POST  /v1/api/auth/register/provider      validates role, creates user_profiles + service_providers row (step 1)
 POST  /v1/api/auth/otp/send               phone OTP via SMTP/SMS
 POST  /v1/api/auth/otp/verify             mark phone_verified

 Use Better Auth's onUserCreate hook to auto-create user_profiles row.

 ---
 Module 3 — Users (modules/users/)

 GET   /v1/api/users/me                    own profile (merged users + user_profiles)
 PATCH /v1/api/users/me                    update name, phone, bio, photo_url
 POST  /v1/api/users/me/photo              upload to MinIO, return URL → update profile_photo_url

 ---
 Module 4 — Service Categories (modules/service-categories/)

 GET   /v1/api/service-categories          public list (active only)
 POST  /v1/api/service-categories          [admin] create
 PATCH /v1/api/service-categories/:id      [admin] update
 DELETE /v1/api/service-categories         [admin] soft delete by IDs

 ---
 Module 5 — Service Providers (modules/providers/)

 GET   /v1/api/providers                   public search (lat, lng, category, rating, radius, sort)
 GET   /v1/api/providers/:id               public profile
 GET   /v1/api/providers/me                own full profile [authenticated provider]
 PATCH /v1/api/providers/me                update bio, hourly_rate, coverage_radius
 PATCH /v1/api/providers/me/online-status  { is_online: bool }
 GET   /v1/api/providers/me/availability   weekly schedule
 POST  /v1/api/providers/me/availability   upsert slots
 GET   /v1/api/providers/me/portfolio      list images
 POST  /v1/api/providers/me/portfolio      upload image (MinIO)
 DELETE /v1/api/providers/me/portfolio/:id soft delete
 POST  /v1/api/providers/me/documents      upload CNIC / certs (MinIO)
 GET   /v1/api/providers/me/services       offered service list
 POST  /v1/api/providers/me/services       add service + price
 PATCH /v1/api/providers/me/services/:id   update
 DELETE /v1/api/providers/me/services/:id  soft delete

 Business logic notes:
 - Provider search: use PostGIS earth_distance extension OR approximate lat/lng bounding box query for distance filtering
 - Average rating: computed from reviews, cached on service_providers.average_rating via trigger or on review creation
 - Tier progression: cron job or event-driven recalculation based on total_jobs_completed and average_rating

 ---
 Module 6 — Customers (modules/customers/)

 GET   /v1/api/customers/me                own profile
 PATCH /v1/api/customers/me                update status
 GET   /v1/api/customers/me/addresses      list saved addresses
 POST  /v1/api/customers/me/addresses      add address
 PATCH /v1/api/customers/me/addresses/:id  update
 DELETE /v1/api/customers/me/addresses/:id delete
 PATCH /v1/api/customers/me/addresses/:id/default  set as default

 ---
 Module 7 — Bookings (modules/bookings/)

 POST  /v1/api/bookings                    create booking (customer)
 GET   /v1/api/bookings                    list (customer sees own; provider sees own; query ?role=)
 GET   /v1/api/bookings/:id               detail
 PATCH /v1/api/bookings/:id/status        { status: 'accepted' | 'travelling' | 'arrived' | 'in_progress' | 'completed' }
 POST  /v1/api/bookings/:id/cancel        { reason }
 PATCH /v1/api/bookings/:id/reschedule    { scheduled_at }
 POST  /v1/api/bookings/:id/complete-photo  provider uploads after-job photos

 Status machine:
 pending → accepted → travelling → arrived → in_progress → completed
         ↘ rejected (by provider)
 pending/accepted/travelling → cancelled (by customer or provider)
 completed → disputed (if review flags an issue)

 ---
 Module 8 — Payments (modules/payments/)

 POST  /v1/api/payments                    initiate payment for booking_id
 GET   /v1/api/payments/:id               payment detail
 POST  /v1/api/payments/webhooks/jazzcash  JazzCash callback
 POST  /v1/api/payments/webhooks/easypaisa EasyPaisa callback
 GET   /v1/api/providers/me/earnings       earnings summary (filter: today/week/month)
 POST  /v1/api/providers/me/payouts/request  request payout
 GET   /v1/api/providers/me/payouts        payout history

 Escrow flow:
 1. Customer pays → payment_status = held
 2. Job completed → payment_status = completed, provider_payout credited
 3. Dispute → held until resolved by admin

 ---
 Module 9 — Reviews (modules/reviews/)

 POST  /v1/api/reviews                     create review (only for completed bookings, once per booking)
 GET   /v1/api/reviews/provider/:id        list provider reviews with pagination

 On review creation → recalculate service_providers.average_rating.

 ---
 Module 10 — Notifications (modules/notifications/)

 GET   /v1/api/notifications               list for auth user (paginated)
 PATCH /v1/api/notifications/read          mark list of IDs as read
 PATCH /v1/api/notifications/read-all      mark all as read

 Internal NotificationService.send(userId, type, data) called from other services (bookings, payments, etc.).

 ---
 Module 11 — Conversations & Messages (modules/chat/)

 GET   /v1/api/conversations               list user's conversations
 POST  /v1/api/conversations               create or get existing (for booking_id)
 GET   /v1/api/conversations/:id/messages  paginated message history
 POST  /v1/api/conversations/:id/messages  send message

 Real-time: Hono supports WebSocket via hono/ws. Add GET /v1/api/chat/ws for WebSocket upgrade. (Phase 2 enhancement — REST first.)

 ---
 Module 12 — Admin (modules/admin/)

 All routes protected by isAdmin middleware.

 GET   /v1/api/admin/dashboard             KPIs: active bookings, new applications, revenue, online users
 GET   /v1/api/admin/providers             list with filters (pending/approved/rejected)
 GET   /v1/api/admin/providers/:id         full provider detail + documents
 PATCH /v1/api/admin/providers/:id/verify  { action: 'approve' | 'reject' | 'request_info', note }
 GET   /v1/api/admin/customers             user management table
 PATCH /v1/api/admin/users/:id/suspend     { reason, duration_days }
 PATCH /v1/api/admin/users/:id/ban         { reason }
 PATCH /v1/api/admin/users/:id/unsuspend
 GET   /v1/api/admin/bookings              all bookings with filters
 PATCH /v1/api/admin/bookings/:id/assign   reassign provider
 POST  /v1/api/admin/bookings/:id/refund   trigger refund
 GET   /v1/api/admin/payments              transactions table
 GET   /v1/api/admin/payouts               pending payout queue
 POST  /v1/api/admin/payouts/:id/approve
 GET   /v1/api/admin/fraud-flags           flagged accounts
 PATCH /v1/api/admin/fraud-flags/:id       { action: 'investigate' | 'suspend' | 'clear' }
 GET   /v1/api/admin/commission-settings   per-tier rates
 PATCH /v1/api/admin/commission-settings   update rates
 GET   /v1/api/admin/analytics             aggregated charts data

 ---
 Module 13 — File Uploads (modules/upload/)

 POST  /v1/api/upload/image                multipart/form-data → MinIO → return { url, key }
 DELETE /v1/api/upload/image/:key          delete from MinIO

 MinIO client already configured in packages/api/src/config/ (env vars: MINIO_*). Bucket: MINIO_BUCKET_NAME.

 ---
 Critical Files to Modify

 ┌───────────────────────────────────────┬─────────────────────────────────────────┐
 │                 File                  │                 Change                  │
 ├───────────────────────────────────────┼─────────────────────────────────────────┤
 │ database/database.dbml                │ Full rewrite with normalized schema     │
 ├───────────────────────────────────────┼─────────────────────────────────────────┤
 │ packages/api/src/db/models/*.model.ts │ New model files per domain              │
 ├───────────────────────────────────────┼─────────────────────────────────────────┤
 │ packages/api/src/db/tables.ts         │ Register all new tables                 │
 ├───────────────────────────────────────┼─────────────────────────────────────────┤
 │ packages/api/src/app.ts               │ Register all new module routers         │
 ├───────────────────────────────────────┼─────────────────────────────────────────┤
 │ packages/api/src/db/seeds/            │ Add lookup table seeders                │
 ├───────────────────────────────────────┼─────────────────────────────────────────┤
 │ packages/api/.env                     │ Ensure MINIO_* and SMTP_* are populated │
 └───────────────────────────────────────┴─────────────────────────────────────────┘

 ---
 Existing Patterns to Reuse

 ┌────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
 │          Pattern           │                                          File                                           │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Module structure           │ packages/api/src/modules/colors/ (canonical example)                                    │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Route definition (OpenAPI) │ colors.route.ts — use createRoute, jsonContent, commonErrorResponses                    │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Handler thin layer         │ colors.handler.ts — c.req.valid('json'), successResponse, successResponseWithPagination │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Service + Repository       │ colors.service.ts, colors.repository.ts                                                 │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Soft delete pattern        │ isDeleted: boolean, deletedAt: timestamp on all entity tables                           │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Drizzle model pattern      │ colors.model.ts — pgTable, createSelectSchema, createInsertSchema                       │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Auth middleware            │ packages/api/src/core/middlewares/auth-validation-middleware.ts                         │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Error classes              │ packages/api/src/core/errors/ — NotFoundError, AppError                                 │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ Pagination                 │ createPagination() from @/lib/searching-sorting                                         │
 ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ OpenAPI schemas            │ @/lib/openapi/schemas — idParams, createSuccessResponseSchema                           │
 └────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

 ---
 Development Order

 1. DBML rewrite + normalize
 2. Drizzle models (all tables)
 3. db:generate + db:migrate + db:seed (lookup data)
 4. Auth extension (registration flows)
 5. Users module
 6. Service Categories module
 7. Service Providers module (core of the app)
 8. Customers module
 9. Bookings module
 10. Payments module (JazzCash/EasyPaisa integration)
 11. Reviews module
 12. Notifications module
 13. Admin module
 14. Chat/Conversations module
 15. File Upload module (MinIO)

 ---
 Verification

 After each module:
 1. pnpm dev:api — confirm server starts without errors
 2. pnpm orval — confirm OpenAPI spec exports and client generates
 3. Drizzle Studio (pnpm db:studio) — confirm table rows are correct
 4. Use Swagger UI at http://localhost:9999/ui to test endpoints manually
 5. pnpm check — type-check + lint before committing

 After all modules:
 - Run pnpm db:setup on a clean DB to verify migrations + seeds work end-to-end
 - Smoke test the full Customer flow: register → search provider → book → pay → review
 - Smoke test the Admin flow: login → approve provider → view bookings → process payout