# PRD — Together App: AWS Migration & Real-Time Messaging

## 1. Overview

Together is a Next.js 14 social app (posts, comments, likes, friends, direct messages, notifications) currently deployed on Vercel with MongoDB (Mongoose) and uploadthing for image uploads. Messaging today has no real-time delivery — clients only see new messages on refetch.

This project migrates the app to an AWS serverless architecture and adds real-time messaging, while keeping the existing Next.js codebase. The end state is a single coherent system that demonstrates: WebSockets, Lambda (HTTP, WebSocket, and S3-event triggers), S3, CloudFront, and relational data modeling on Postgres.

## 2. Goals

1. Deploy the existing Next.js app to AWS (Lambda + CloudFront + S3) via SST/OpenNext with no framework rewrite.
2. Real-time direct messaging over WebSockets using API Gateway WebSocket API + Lambda.
3. Replace uploadthing with an S3 + Lambda image pipeline (presigned uploads, event-triggered optimization with sharp).
4. Migrate all data from MongoDB/Mongoose to Neon Postgres with a properly normalized schema.
5. Keep total infra cost near zero (free tiers: Neon, Lambda, API Gateway; S3/CloudFront pennies at hobby scale).

## 3. Non-Goals

- No rewrite to standalone React + Express/Node. Next.js stays.
- No auth provider migration. The existing custom JWT auth (jose/bcryptjs, email verification via nodemailer) stays, ported as-is to the new DB layer.
- No group chat, typing indicators, or read receipts in v1 of WebSocket messaging (listed as stretch goals).
- No data backfill from the existing MongoDB instance (hobby data; schema starts fresh). If backfill is wanted later, it's a one-off script, not part of this project.
- No mobile/PWA changes beyond keeping current next-pwa behavior working.

## 4. Resolved Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Keep Next.js 16 (App Router) | Rewrite adds weeks, removes interview talking points (OpenNext architecture) |
| Database | Neon Postgres | Free tier, serverless driver works over HTTP from Lambda, branching for dev |
| ORM | Drizzle ORM + `@neondatabase/serverless` | Lightweight, SQL-first (better interview signal than Prisma's abstraction), first-class Neon support |
| IaC / deploy | SST v3 | OpenNext under the hood for Next.js; same config defines WebSocket API, S3 buckets, Lambdas |
| WebSockets | API Gateway WebSocket API + Lambda handlers | Canonical serverless pattern; raw `WebSocket` on the client (no Socket.IO — doesn't fit Lambda) |
| WS connection store | `ws_connections` table in Neon | Keeps one database; DynamoDB is the textbook choice but adds a second datastore for no benefit at this scale |
| Image uploads | S3 presigned URLs + S3-event Lambda running sharp | Replaces uploadthing; classic Lambda use case |
| Auth | Keep custom JWT (jose), httpOnly cookie | Already built; WS auth reuses the same JWT as a query param on `$connect` |
| Email | Keep nodemailer (move to prod dependencies) | Out of scope to change; SES is a possible later swap |

## 5. Architecture

```
                          ┌─────────────────────────────────────────┐
                          │                  AWS                    │
  Browser ── HTTPS ──────▶│ CloudFront ─▶ OpenNext (Lambda: SSR/API,│
     │                    │              S3: static, Lambda: image  │
     │                    │              optimization)              │
     │                    │                                         │
     ├── WSS ────────────▶│ API GW WebSocket API ─▶ Lambda handlers │
     │                    │   ($connect/$disconnect/sendMessage)    │
     │                    │                                         │
     └── PUT (presigned)─▶│ S3 uploads bucket ─▶ S3 event ─▶ Lambda │
                          │   (sharp resize) ─▶ S3 media bucket     │
                          └───────────────┬─────────────────────────┘
                                          │
                                   Neon Postgres
                          (app data + ws_connections table)
```

## 6. Workstreams

### WS-A: Postgres migration (Neon + Drizzle) — largest workstream, do first

The current Mongoose schemas are denormalized (messages embedded as an array in `conversations`; likes/comments/friends/posts as untyped arrays on documents). These become proper tables.

**Target schema (tables):**

- `users` — id, name (≤20 chars), email (unique), password_hash, is_verified, profile_photo, bio, forgot_password_token + expiry, verify_token + expiry, timestamps
- `posts` — id, thread (text), creator_id → users, tags (text[]), timestamps
- `post_images` — id, post_id → posts, url, position (replaces `image` array)
- `post_likes` — (post_id, user_id) composite PK (replaces `likes` array)
- `comments` — id, text, creator_id → users, post_id → posts, timestamps
- `friendships` — (user_id, friend_id) composite PK, status (pending/accepted) (replaces `friends` array)
- `conversations` — id, timestamps
- `conversation_members` — (conversation_id, user_id) composite PK (replaces `members` array)
- `messages` — id, conversation_id → conversations, sender_id → users, body, created_at (**replaces the embedded `messages` array — required for WebSocket delivery and pagination**)
- `notifications` — id, user_id (recipient), actor_id, message, destination, read, timestamps
- `ws_connections` — connection_id PK, user_id → users, connected_at (for WS-C)

**Requirements:**
1. Drizzle schema + migrations checked into the repo (`drizzle/`), run against Neon via `drizzle-kit`.
2. Every API route under `app/api/` ported from Mongoose to Drizzle: auth (8 routes), conversation(s), explore, notifications, post(s), search-results, user, user-posts.
3. `lib/mongodb.ts` and `models/` deleted at the end; no mongoose dependency remains.
4. Indexes: `messages(conversation_id, created_at)`, `notifications(user_id, read)`, `posts(creator_id)`, `comments(post_id)`, `users(email)` unique.
5. Use Neon database branching: a `dev` branch for local development, `main` for production.

**Acceptance:** all existing flows (register → verify → login → post → comment → like → friend → converse → notifications) work end-to-end against Neon; `mongoose` removed from package.json; existing Jest tests pass.

### WS-B: AWS deployment via SST (do second — establishes the AWS footprint)

**Requirements:**
1. `sst.config.ts` defining the Next.js app (`sst.aws.Nextjs`), with env/secrets for `DATABASE_URL`, JWT secret, mail credentials.
2. App served via CloudFront; static assets from S3; SSR + API routes on Lambda.
3. `next/image` optimization served by OpenNext's image Lambda (sharp).
4. Two stages: `dev` (personal) and `production`.
5. Vercel deployment retired once production on AWS is verified (DNS cutover last).

**Acceptance:** production URL on CloudFront serves the full app; login/session cookies work behind CloudFront; cold-start p95 documented (interview data point).

### WS-C: Real-time messaging (API Gateway WebSocket API + Lambda)

**Requirements:**
1. WebSocket API with routes: `$connect`, `$disconnect`, `sendMessage`.
2. **Auth on `$connect`:** client passes the existing JWT (query string, since browsers can't set WS headers); Lambda verifies with jose, inserts `(connection_id, user_id)` into `ws_connections`. Reject (401) on invalid token.
3. **`$disconnect`:** delete the connection row. Also lazily delete rows on `GoneException` when posting to a stale connection.
4. **`sendMessage` flow:** validate sender is a member of the conversation → insert into `messages` → look up all members' connection IDs → push the message to each via `ApiGatewayManagementApi.postToConnection`. Sender gets an ack; offline recipients simply see the message on next load (it's in Postgres).
5. **Client:** a `useWebSocket` hook — connects after login, reconnects with backoff, dispatches incoming messages into the TanStack Query cache for the open conversation + invalidates the conversations list.
6. Sending messages goes through the WebSocket, not the REST route; REST remains for history/pagination.

**Stretch (post-v1):** typing indicators, read receipts, online presence, WS-pushed notifications.

**Acceptance:** two browsers logged in as different users exchange messages with no refresh; messages persist across reload; stale connections cleaned up; unauthenticated WS connections rejected.

### WS-D: Image pipeline (S3 + Lambda, replacing uploadthing)

**Requirements:**
1. `uploads` S3 bucket (private) and `media` S3 bucket (served via CloudFront, not public-read).
2. API route `POST /api/upload-url`: authenticated, validates content-type (image/*) and size limit (8 MB), returns a presigned PUT URL keyed `uploads/{userId}/{uuid}`.
3. S3 `ObjectCreated` event on `uploads` triggers an optimizer Lambda: sharp → resize to defined variants (e.g. 1080w post, 256w avatar), encode WebP → write to `media` bucket → delete the original from `uploads`.
4. Client upload flow replaces `@uploadthing/react` components in post-creation and profile-photo screens; stored URLs point at the CloudFront media domain.
5. `uploadthing`, `@uploadthing/react`, `lib/uploadthing.ts`, `lib/uploadImage.ts`, and the `api/uploadthing` route removed at the end.

**Acceptance:** creating a post with an image and changing a profile photo work end-to-end; optimized WebP variants appear in the media bucket; no uploadthing dependency remains.

## 7. Sequencing

| Phase | Workstream | Why this order |
|---|---|---|
| 1 | WS-A (Neon + Drizzle) | Most invasive; everything else builds on the new data layer (WS handlers and `ws_connections` need Drizzle) |
| 2 | WS-B (SST deploy) | Establishes AWS footprint with the app as-is; later Lambdas live in the same SST config |
| 3 | WS-D (S3 images) | Smaller, self-contained; exercises SST + S3 + Lambda before the harder WS work |
| 4 | WS-C (WebSockets) | The headline feature, built last on a stable foundation |

Each phase lands on `main` independently deployable; the app must remain fully working between phases (phase 1 still deploys to Vercel; Vercel is retired at the end of phase 2).

## 8. New environment variables / secrets

- `DATABASE_URL` (Neon, per-branch)
- `JWT_SECRET` (existing, moves into SST secrets)
- `MAIL_USER` / `MAIL_PASS` (existing nodemailer creds)
- `WS_API_URL` (public, exposed to client as `NEXT_PUBLIC_WS_URL`)
- `UPLOADS_BUCKET`, `MEDIA_BUCKET`, `MEDIA_CDN_URL`
- AWS credentials are ambient (SST/Lambda roles), never stored in env files

## 9. Risks & mitigations

- **Mongoose → Drizzle port touches every API route.** Mitigate by porting route-group-by-route-group behind passing manual smoke tests; existing Jest suite runs throughout.
- **WS auth via query string can leak tokens into logs.** Mitigate: short-lived dedicated WS ticket token minted by an authenticated REST call, or at minimum disable access logging of query strings on the WS stage.
- **Neon cold starts (free tier suspends after inactivity)** add ~500ms to first query. Acceptable for a hobby/demo app; document it as a known tradeoff (interview talking point).
- **API Gateway WS idle timeout is 10 min** — client must send periodic pings or reconnect transparently; handled by the `useWebSocket` hook's reconnect logic.
- **Lambda concurrency vs Neon connection limits** — use the Neon HTTP serverless driver (no persistent pool) to avoid exhausting connections.

## 10. Success criteria (demo script for interviews)

1. Open the production CloudFront URL, log in, browse the feed (SSR on Lambda).
2. Create a post with a photo; show the optimized WebP in the media bucket / network tab (S3 + event Lambda).
3. Open a second browser as another user; exchange DMs instantly with no refresh (API GW WebSocket + Lambda).
4. Show the Drizzle schema and a Neon dashboard query (relational modeling).
5. Show `sst.config.ts` as the single definition of the whole architecture (IaC).
