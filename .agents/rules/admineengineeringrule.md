---
trigger: always_on
---

# LUXE Admin Engineering Rules

You are working on the production-style Next.js App Router ecommerce project **LUXE**.

Act like a careful senior engineer. Work incrementally and never continue beyond the exact phase approved by the user.

## Working Discipline

For every task:

1. Inspect relevant existing files first.
2. Understand existing architecture before editing.
3. State which files you plan to modify or create.
4. Implement only the approved scope.
5. Verify the work.
6. Report changed files and verification results.
7. STOP and wait for user approval.

Never automatically continue to another phase.

Always end implementation phases with:

**PHASE COMPLETE — WAITING FOR USER APPROVAL.**

## Existing Code

The project already contains partially implemented admin files.

Always prefer:

**inspect → reuse → improve**

Never:

**delete → recreate**

unless explicitly approved.

Do not duplicate existing files, rename/move folders, delete files, rewrite unrelated code, or change working architecture without permission.

Keep the existing admin route location unless explicitly instructed otherwise:

`src/app/admin/`

Do not move it into a route group automatically.

## Architecture Boundaries

Use these responsibilities:

* `src/app/admin` → Admin UI pages/layout
* `src/app/api/admin` → Admin HTTP Route Handlers
* `src/components/admin` → Admin presentation/components
* `src/lib/queries/admin` → Database reads
* `src/lib/mutations/admin` → Database writes/business rules
* `src/lib/validation` → Server-side validation
* `src/lib/auth` → Authentication/authorization
* `src/lib/cache` → Cache tags/invalidation
* `src/services/cloudinary` → Cloudinary server integration
* `src/models` → Mongoose models

Queries read data.

Mutations change data and enforce business rules.

Server Components should call secure query functions directly instead of calling this application's own API unnecessarily.

## Security

Never trust React UI, middleware, or layout checks as the only security boundary.

Sensitive operations must authorize on the server.

Admin Route Handlers must independently verify authentication and authorization.

Never expose:

* JWT secrets
* Cloudinary secrets
* private environment variables
* database credentials

Never rely only on client-side validation.

Client validation improves UX; server validation protects the system.

Sensitive server modules must remain server-only.

## Client and Server Components

Prefer Server Components by default.

Use `"use client"` only when needed for:

* state
* browser APIs
* client hooks
* interactive forms
* dialogs
* dropdowns
* interactive filters

Do not unnecessarily turn large component trees into Client Components.

## Admin Data

Operational admin data should generally remain fresh, especially:

* inventory
* order details
* order status
* product editing

Short caching may be used for expensive dashboard analytics.

Public storefront catalog data may use targeted caching and cache-tag invalidation.

Do not cache everything automatically.

Checkout-critical values such as current price, stock, and availability must be verified against authoritative server/database data.

## Business Rules

Do not blindly perform destructive database operations.

Before deleting entities, consider relationships.

Examples:

* Brand may be referenced by Products.
* Category may have child Categories or Products.
* Product deletion may require Cloudinary asset cleanup.

Order statuses must use valid transitions and must not accept arbitrary strings.

Products are complex and should use dedicated Product components rather than being forced into a generic entity form.

Shared components should reduce genuine duplication without becoming configurable mega-components.

## Packages and Environment

Never install packages or modify `package.json` without explicit permission.

Never modify `.env.local` values without explicit permission.

If configuration is missing, report what is required without inventing secret values.

## Git Control

The user handles Git manually.

Never run:

* `git commit`
* `git push`
* `git checkout`
* `git switch`
* `git merge`
* `git rebase`

unless explicitly requested for that exact operation.

Never use destructive Git commands.

You may run read-only commands such as:

* `git status`
* `git diff`
* `git branch --show-current`

when appropriate.

## Parallel Agents

Avoid multiple agents editing the same files simultaneously.

Prefer:

* one implementation agent
* read-only reviewer agent
* verification agent

Reviewer agents must not edit files unless explicitly asked.

## Verification

After implementation, run available safe checks such as lint, type-check, build, or relevant tests.

Fix only issues introduced by the current phase.

Report pre-existing unrelated errors separately.

At completion report:

* files inspected
* files created
* files modified
* verification commands
* verification results
* remaining issues

Do not perform unrelated refactors.

The objective is not maximum code generation.

The objective is to build LUXE securely, professionally, incrementally, and without unnecessary complexity.

When a significant architectural decision is unclear, STOP and ask the user instead of guessing.