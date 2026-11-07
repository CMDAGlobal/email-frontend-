# Dispatch frontend

React 19 + TypeScript + Vite admin application. This revision expands the original Dispatch design into connected product pages, with responsive layouts, persistent light/dark theme, global contact search, activity, keyboard-accessible dialogs, loading/error/empty states, and action notifications.

## Pages and interactions

- Dashboard: backend counts, daily send/engagement charts, delivery outcomes, recent campaigns and activity.
- Contacts: server-side search, pagination, status/list/tag/segment filters, contact create/edit drawers, lead scores, custom fields, list/tag membership, bulk add/tag/archive, and unsubscribe.
- CSV import: file selection, consent source, target list, server preview, row errors, and explicit commit. Up to 2,000 rows / 900 KB; additional columns become JSONB fields.
- Lists: create/edit descriptions, membership and eligible counts, view contacts, guarded deletion.
- Segments & tags: all-match rule builder, live server count preview, tag colors and membership totals.
- Campaigns: searchable status tabs, draft editing, duplicate, pause/resume/cancel, recipient logs, and a five-step setup/audience/content/review/schedule wizard.
- Email templates: drag/drop block library, selection inspector, reorder/duplicate/delete, merge tags, desktop/mobile preview, and custom HTML mode. The editor uses an internal design JSON format and email-safe tables; no external editor license or dependency is required.
- Automations: visual step canvas with email/delay/tag/score/condition/end steps, branch targets, list/tag/form/manual triggers, pause/activate, manual contact enrollment, and activity.
- Forms & landing pages: branded signup editor, preview, publish/draft state, share URLs/embed code, and request/confirmation counts. Public forms use double opt-in.
- Transactional: delivery log, recipient/status filters, message composer, saved-template selection, merge variables, and API request documentation.
- Reports: period selection, charts, campaign statistics, tracked links, activity and authenticated CSV download.
- Suppressions: search, manual addition/removal and protected bounce/complaint/unsubscribe records.
- Settings: workspace identity, footer details, timezone, reply-to, tracking consent switch, SES domain/DKIM actions, custom fields, and scoped transactional API keys shown once.

## Source organization

`src/App.tsx` exports the product root in `src/product/WorkspaceApp.tsx`. Pages and the email designer are lazy-loaded. `src/product/session.tsx` owns authenticated requests, resource loading, invalidation, notifications, downloads, and hash routing. `ui.tsx` holds shared form/dialog/table primitives. The original prototype remains unchanged at `reference/prototype.html` (outside `public/`, never built or served); its style tokens live in `styles/reference.css`, with product layout rules in `styles/product.css`.

The modern product API is `/api/v1/manage/*`. Admin access supports account sign-in with an HTTP-only cookie, session restoration, CSRF-protected writes and sign-out. A workspace-key tab remains for bootstrap/recovery; that key is held only in sessionStorage, never embedded in the bundle. Transactional integration keys are separate, hashed server-side, and cannot access admin routes.

## Run later

The latest source was intentionally NOT built, type-checked, tested, or browser-checked at the user's request. Database migrations were not executed. Earlier scaffold validation is historical only.

When ready, apply the backend migrations and run its API and worker. Then:

```sh
npm ci
npm run dev
```

Open http://localhost:5173 and enter the backend's admin key. Vite proxies `/api`, `/public`, `/track`, and `/unsubscribe` to port 3000. The sibling backend's Compose file can instead serve the built frontend with Nginx. No extra frontend dependencies were added in this revision.

Campaign scheduling accepts a local browser date/time, displays the browser timezone, and sends an absolute ISO timestamp. Delivery counts refresh through page navigation, mutation invalidation, or visible refresh controls; there is no background browser polling. Public form confirmation URLs use the backend's PUBLIC_API_URL.

## Operational completion additions

- Account: forced temporary-password replacement, password change and active-session management.
- Team & access: owner/editor/analyst accounts, account enable/disable and one-time temporary-password reset flows. Owner-only navigation is hidden from other roles; the API is authoritative for permissions.
- Audit history: searchable, paginated actor/action/resource history without secret payloads.
- Delivery operations: paginated recipient log, source/status filters, state summaries and explicit reconciliation notes. Failed messages can be retried only where the server can exclude a prior provider request.
- Workflow recovery: retry/stop individual enrollments; email steps wait for delivery completion before advancing.
- Contact data tools: active/archive CSV export, paginated archive browsing and restore.
- Import: server column inspection, mapping for email/name/status/tags/score, duplicate reporting, archived-contact choice and explicit workflow enrollment choice.
- Editing protection: unsaved campaign leave warnings and a page-level error boundary.
- Reporting: workspace-timezone daily buckets, engagement recency segment rules and a data-driven delivery gauge.

Apply migration 003 along with any earlier outstanding migrations before using these additions. The latest source still has not been compiled, tested, rendered, or executed. No runtime/visual verification is implied by this feature list.


## CMDA connector addition

See `../CMDA-CONNECTOR.md` for current sync/feedback behavior, consent rules, environment mapping and unexecuted rollout checks. The Dispatch connection UI and backend are wired; source verification and environment setup remain outstanding. Apply all pending migrations through 005 before starting this revision.
