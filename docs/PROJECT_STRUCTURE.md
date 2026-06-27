Dhanashree ERP

Project Structure

Version: 1.0

Stack

* Next.js 15 (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* Supabase
* PostgreSQL
* React Query
* React Hook Form
* Zod

⸻

Folder Structure

dhanashree-erp/
apps/
└── web/
    app/
        (auth)/
        dashboard/
        projects/
        suppliers/
        workforce/
        documents/
        settings/
        api/
    components/
        ui/
        layout/
        shared/
    features/
        dashboard/
        projects/
            components/
            hooks/
            services/
            types/
        transactions/
        suppliers/
        workforce/
        documents/
        analytics/
    lib/
        auth/
        database/
        utils/
        validations/
    services/
        financial-calculator/
        ocr/
        notifications/
        ai/
    supabase/
        migrations/
        seed/
    types/
    hooks/
    constants/

⸻

Architecture

Frontend
↓
Server Actions / API Routes
↓
Business Services
↓
Supabase
↓
PostgreSQL

Business logic should never exist inside UI components.

⸻

Feature Structure

Each feature follows the same structure.

projects/
components/
hooks/
services/
types/
validation.ts
constants.ts
index.ts

⸻

Naming Rules

Components

PascalCase

Example

ProjectCard.tsx

⸻

Hooks

camelCase

Example

useProjects.ts

⸻

Services

camelCase

Example

projectService.ts

⸻

Validation

Zod

Example

project.schema.ts

⸻

Styling

Only

TailwindCSS

shadcn/ui

No CSS files.

No Bootstrap.

No Material UI.

⸻

State

Server Data

TanStack Query

Local State

React

Forms

React Hook Form

Validation

Zod

⸻

Authentication

Supabase Auth

Roles

* Owner
* Manager
* Accountant

⸻

File Uploads

Supabase Storage

Buckets

* documents
* project-images
* profile-images

⸻

AI

OCR

↓

Review

↓

Confirm

↓

Create Records

Never bypass confirmation.

⸻

Development Rules

* Keep features isolated.
* Reuse components.
* Never duplicate business logic.
* Never calculate financial values in UI.
* All calculations go through Financial Calculator Service.

⸻

Definition of Done

A feature is complete when

* Database complete
* API complete
* UI complete
* Validation complete
* Mobile responsive
* Tested

:::
---
# 🚀 GOOD NEWS
We're almost done with documentation.
I don't want to write another 50 pages.
Instead, here's what I think we should do.
---
# Remaining Docs
| Document | Time |
|------------|------|
| ✅ PROJECT_STRUCTURE | Done |
| TRD | 15 min |
| API | 20 min |
| ROADMAP | 10 min |
**Total documentation left: ~45 minutes.**
---
# Then...
# 🚀 We open VS Code.
Seriously.
---
## Here's where I think we should start coding
Instead of authentication.
Instead of login.
Instead of UI.
We build the foundation.
### Sprint 1
```text
Supabase
↓
Database
↓
Authentication
↓
shadcn
↓
Layout
↓
Project Workspace

⸻

Sprint 2

Transactions
↓
Cashflow
↓
Financial Calculator

⸻

Sprint 3

Workforce
↓
Attendance
↓
Salary

⸻

Sprint 4

Documents
↓
OCR
↓
Suppliers

⸻

Sprint 5

Dashboard
↓
Analytics
↓
Reports
↓
AI

⸻

🎯 I have one final suggestion before we code.

I think this repository is now important enough that it deserves a proper README.md that acts as the entry point for both humans and AI.

Not a typical README.

A professional one that explains:

* What Dhanashree ERP is.
* The architecture.
* The tech stack.
* How to run it locally.
* Project structure.
* Development workflow.
* Coding conventions.
* Links to all the documents we’ve created.

That README becomes the first file anyone (including an AI coding agent) reads when they open the repository.

My recommendation

Let’s finish these last three lightweight documents:

1. README.md
2. TRD.md (condensed to ~3–5 pages)
3. API.md (all endpoints in one place)

Then we stop documentation completely and start building Sprint 1.

At that point, we’ll switch from “software architects” to “software engineers.” I think that’s exactly where we want to be. 🚀