# AI_CONTEXT.md

# Dhanashree ERP

This document is the permanent context for AI coding agents.

Read this before generating any code.

---

# Project Purpose

Dhanashree ERP is a contractor management platform built specifically for a building elevation business.

The software replaces:

- Excel
- Paper ledgers
- Manual cashflow tracking
- Labour notebooks

The primary objective is:

> Help the owner understand exactly where money is coming from and where it is going.

Everything in the application supports this goal.

---

# Core Philosophy

The application is built around Projects.

Every important business activity belongs to a Project.

Projects generate Transactions.

Transactions generate Cashflow.

Cashflow powers Dashboards, Analytics and Reports.

Never design features outside this flow.

---

# Core Architecture

Project Workspace

↓

Daily Site Log

↓

Transaction Engine

↓

Financial Calculator

↓

Cashflow Engine

↓

Dashboard

↓

Analytics

↓

Reports

---

# Technology Stack

Frontend

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui

Backend

- Supabase
- PostgreSQL
- Server Actions
- Route Handlers

Validation

- Zod

State

- TanStack Query

Storage

- Supabase Storage

Authentication

- Supabase Auth

---

# Database Philosophy

Store facts.

Never store calculations.

Examples

Store

- Transactions
- Attendance
- Payments
- Documents

Never Store

- Profit
- Cashflow
- Outstanding Balance
- Salary Due
- Dashboard Metrics

Everything is calculated by services.

---

# Financial Rules

Every movement of money creates a Transaction.

Payments settle Transactions.

Cashflow is calculated.

Profit is calculated.

Supplier balances are calculated.

Never calculate money inside React components.

---

# Workforce Rules

Attendance is the source of truth.

Salary is generated.

Salary is never manually entered.

Salary payments create Transactions.

---

# OCR Rules

OCR never creates records automatically.

OCR only creates Drafts.

The user must confirm before records are created.

---

# Business Rules

Projects cannot be deleted.

Financial history cannot be deleted.

Use soft delete.

Every financial change creates an Audit Log.

Every uploaded document remains attached to its project.

---

# Coding Rules

Always

✅ Use TypeScript

✅ Use Server Components by default

✅ Validate using Zod

✅ Keep business logic in Services

✅ Keep UI components dumb

✅ Build mobile-first

✅ Reuse components

Never

❌ Duplicate business logic

❌ Store calculated values

❌ Calculate financial metrics in UI

❌ Bypass validation

❌ Hard delete financial records

❌ Mix UI and business logic

---

# Folder Structure

Feature-first architecture.

Example

features/

projects/

transactions/

workforce/

suppliers/

documents/

dashboard/

analytics/

reports/

---

# Development Strategy

Build vertical slices.

Each feature includes

- Database
- Backend
- UI
- Validation
- Testing

Finish one feature before starting another.

---

# Current MVP

Included

- Authentication
- Projects
- Transactions
- Cashflow
- Workforce
- Daily Site Logs
- Suppliers
- Documents
- OCR
- Dashboard
- Analytics
- Reports

Excluded

- Inventory
- Purchase Orders
- GST Filing
- Fleet
- Client Portal

---

# Current Sprint

Sprint 1

Goal

Build the Project Workspace.

Tasks

- Supabase Setup
- Authentication
- Database
- Layout
- Project CRUD

Definition of Done

- Database complete
- API complete
- UI complete
- Mobile responsive
- Tested

---

# AI Instructions

When generating code:

1. Read this file first.
2. Follow DATABASE.md.
3. Follow the relevant feature specification.
4. Generate production-quality code.
5. Prefer simple solutions over complex abstractions.
6. Do not introduce unnecessary libraries.
7. Ask for clarification only if business requirements are ambiguous.

The goal is to build a reliable, maintainable ERP that a small business owner can use every day.