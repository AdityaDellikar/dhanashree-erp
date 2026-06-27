Dhanashree ERP

Database Architecture

Version: 1.0

Status: Draft

⸻

Purpose

Define the core database architecture for Dhanashree ERP.

The database is the single source of truth for all business operations.

⸻

Database Principles

* PostgreSQL (Supabase)
* Normalize source data
* Store facts, calculate summaries
* Use UUID primary keys
* Soft delete business records
* Audit important changes
* Every table has created_at and updated_at

⸻

Core Entities

Company

Owns the ERP instance.

⸻

User

Owner, Manager, Accountant.

⸻

Client

Customer awarding projects.

⸻

Project

Central workspace for all operations.

⸻

Transaction

Every financial movement.

⸻

Payment

Settlement of a transaction.

⸻

Supplier

Vendor providing materials or services.

⸻

Labour

Worker assigned to projects.

⸻

Attendance

Daily labour records.

⸻

Site Log

Daily operational report.

⸻

Document

Uploaded files and OCR source.

⸻

Entity Relationships

Company

└── Projects

  ├── Transactions

  ├── Documents

  ├── Site Logs

  ├── Attendance

  └── Suppliers

Transactions

├── Payments

└── Documents

Labour

└── Attendance

⸻

Design Rules

* Every transaction belongs to one project.
* Every document belongs to one project.
* Attendance belongs to labour and project.
* Payments belong to transactions.
* Site Logs generate attendance and transactions.
* Financial summaries are never stored.

⸻

Estimated Tables

Core Tables

* companies
* users
* clients
* projects
* transactions
* payments
* suppliers
* labours
* attendance
* site_logs
* documents

Support Tables

* project_members
* categories
* audit_logs
* notifications
* ai_jobs
* document_ocr_results

Estimated Total

16–18 tables.

⸻

Future Expansion

The architecture supports future modules without redesign.

Examples

* Inventory
* Purchase Orders
* Fleet
* Warehouses
* Client Portal
* Vendor Portal
* Multi-company