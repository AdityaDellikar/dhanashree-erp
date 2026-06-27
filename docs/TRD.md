# Dhanashree ERP

# Technical Design Document (TRD)

Version: 1.0

---

# Purpose

This document defines the technical architecture, technology stack, development conventions, and deployment strategy for Dhanashree ERP.

The goal is to provide a clear implementation guide for developers and AI coding agents.

---

# Technology Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

---

## Backend

- Next.js Route Handlers
- Server Actions
- Supabase
- PostgreSQL
- Supabase Storage
- Supabase Auth

---

## AI

- OpenAI API
- OCR (Mistral OCR / Google Document AI in future)
- AI Chat Assistant

---

## Deployment

Frontend

- Vercel

Backend

- Supabase

Storage

- Supabase Storage

---

# Architecture

```
Browser

↓

Next.js

↓

Server Actions / API Routes

↓

Business Services

↓

Supabase

↓

PostgreSQL
```

---

# Core Services

## Project Service

- Create Project
- Update Project
- Archive Project

---

## Transaction Service

- Create Transaction
- Reverse Transaction
- Payment Processing

---

## Financial Calculator

Responsible for:

- Cashflow
- Profit
- Outstanding Amounts
- Dashboard Metrics

---

## Workforce Service

Responsible for:

- Attendance
- Salary Calculation
- Labour History

---

## OCR Service

Responsible for:

- OCR Processing
- AI Extraction
- Draft Generation

---

## Notification Service

Responsible for:

- Action Center
- Payment Reminders
- Missing Site Logs

---

# Authentication

Supabase Auth

Roles

- Owner
- Manager
- Accountant

Permissions controlled using Row Level Security (RLS).

---

# File Storage

Buckets

- documents
- site-images
- profile-images

---

# Validation

All request validation uses Zod.

Validation must occur before database operations.

---

# Error Handling

Standard response format

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Coding Standards

- TypeScript Strict Mode
- ESLint
- Prettier
- Feature-first architecture
- No duplicated business logic
- No financial calculations in UI

---

# Security

- RLS enabled on all business tables
- Server-side authorization
- Secure file uploads
- Audit all financial changes

---

# Performance

- Server Components by default
- Client Components only when necessary
- Lazy loading
- Optimized database queries
- Indexed foreign keys

---

# Testing

Unit Tests

- Business Services

Integration Tests

- APIs

End-to-End

- Critical workflows

---

# MVP Scope

Included

- Projects
- Transactions
- Cashflow
- Workforce
- Suppliers
- Documents
- Dashboard
- Reports
- AI Assistant

Excluded

- Inventory
- GST Filing
- Fleet
- Purchase Orders
- Client Portal

---

# Development Philosophy

- Mobile-first
- AI-assisted development
- Vertical slice implementation
- Build one complete feature at a time
- Ship working software early