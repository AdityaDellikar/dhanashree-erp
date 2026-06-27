Dhanashree ERP

Project Workspace Specification

Version: 1.0

Status: Draft

Dependencies:

* Business Domain
* Event Model
* System Principles

⸻

Table of Contents

1. Purpose
2. Business Objective
3. User Stories
4. Project Lifecycle
5. Project States
6. Project Workspace
7. Workspace Sections
8. Business Rules
9. Permissions
10. Validation Rules
11. Events
12. Database Dependencies
13. API Dependencies
14. AI Opportunities
15. Edge Cases
16. Acceptance Criteria
17. Future Enhancements

⸻

Purpose

The Project Workspace is the central entity of the ERP.

Everything inside the application ultimately belongs to a Project.

A Project acts as the operational workspace where financial activities, labour management, supplier coordination, documents, analytics and communication are connected.

Nothing in the ERP should exist in isolation.

⸻

Business Objective

Provide a single location where the owner can understand everything about a project without opening multiple modules.

The owner should answer these questions within 30 seconds.

* What is this project?
* Who is the client?
* How much is the quotation?
* How much has the client paid?
* How much have we spent?
* Current profit?
* Which labour is working?
* Which suppliers supplied materials?
* What documents exist?
* What work is pending?

⸻

User Stories

Owner

As an owner

I want to view every financial and operational detail of a project

So that I can make informed business decisions.

⸻

Site Manager

As a manager

I want to record attendance, expenses and site updates

So that daily work is documented.

⸻

Accountant

As an accountant

I want to reconcile supplier payments and client receipts

So that financial records remain accurate.

⸻

Project Lifecycle

Every project follows the same lifecycle.

Lead
↓
Quotation
↓
Negotiation
↓
Work Order
↓
Project Created
↓
Planning
↓
Execution
↓
Monitoring
↓
Completion
↓
Billing
↓
Closed
↓
Archived

Projects may move forward or backward between states depending on business needs.

⸻

Project Statuses

Draft

Quotation Sent

Quotation Approved

Waiting for Work Order

Planning

Active

Paused

On Hold

Completed

Financially Closed

Archived

Cancelled

Every status transition generates an audit event.

⸻

Creating a Project

Projects may be created from:

* Manual Entry
* Work Order OCR
* Accepted Quotation
* AI-assisted extraction

Minimum required fields

* Project Name
* Client
* Site Address
* Start Date
* Project Manager

Optional

* Expected Completion
* Contract Value
* Area
* Notes
* Attachments

⸻

Project Workspace

Every project contains the following sections.

⸻

1. Overview

Displays

Project Name

Status

Client

Location

Manager

Contract Value

Start Date

Expected Completion

Progress

Quick Actions

⸻

2. Financial Summary

Displays

Contract Value

Amount Received

Outstanding Receivable

Total Expenses

Labour Cost

Material Cost

Misc Cost

Transport Cost

Profit

Profit Margin

Cashflow

No values are entered manually.

Everything is calculated.

⸻

3. Daily Activity Timeline

Displays chronological events.

Examples

Attendance Recorded

Invoice Uploaded

Payment Received

Salary Paid

Material Purchased

Project Updated

Project Paused

Every action automatically appears.

⸻

4. Labour

Displays

Active Labour

Attendance

Salary Due

Salary Paid

Advances

Night Shifts

Sunday Shifts

Labour Statistics

⸻

5. Supplier

Displays

Supplier List

Purchase History

Outstanding Balance

Last Purchase

Payment History

⸻

6. Documents

Stores

Work Orders

Quotations

Invoices

Bills

Receipts

Completion Photos

Delivery Challans

Each document remains searchable.

⸻

7. Transactions

Displays

Income

Expenses

Refunds

Adjustments

Every transaction supports filters.

Date

Category

Supplier

Amount

Status

⸻

8. Analytics

Shows

Daily Expenses

Weekly Expenses

Monthly Expenses

Labour %

Material %

Misc %

Profit Trend

Cashflow Trend

Expense Breakdown

⸻

9. Notes

Owner Notes

Manager Notes

Daily Updates

Follow Ups

Risk Notes

Internal Only

⸻

10. Settings

Edit Details

Archive

Close Project

Transfer Ownership

Manage Members

Permissions

⸻

Business Rules

Every project belongs to one client.

Projects cannot be deleted.

Projects may only be archived.

Financial records remain accessible after archival.

Closing a project locks historical transactions.

Completed projects remain searchable.

Project name does not need to be unique.

Project Code must be unique.

⸻

Project Code

Every project receives a generated identifier.

Example

DTC-2026-001
DTC-2026-002
DTC-2026-003

This identifier never changes.

⸻

Permissions

Owner

Full Access

Manager

Attendance

Expenses

Documents

Updates

No financial approvals.

Accountant

Financial Read

Payments

Reports

No project deletion.

Future Admin

Full System Access

⸻

Validation Rules

Required

Project Name

Client

Manager

Location

Status

Start Date

Validation

Completion Date cannot precede Start Date.

Contract Value must be positive.

Client must exist.

Manager must exist.

⸻

Search

Projects must support searching by

Project Name

Client

Manager

Location

Status

Project Code

Supplier

Document

Date

AI Search

Natural language search.

Example

“Show projects where profit is below 15%”

⸻

Filters

Status

Client

Manager

Year

Location

Profitability

Completion Status

⸻

Events

Project Created

Project Updated

Project Archived

Project Closed

Member Added

Document Uploaded

Financial Updated

Labour Updated

Supplier Updated

Timeline Updated

Each event emits through the Event Bus.

⸻

Database Dependencies

Projects

Clients

Transactions

Payments

Labour

Attendance

Suppliers

Documents

Timeline

Users

Audit Logs

⸻

API Dependencies

GET /projects

POST /projects

PATCH /projects/{id}

GET /projects/{id}

GET /projects/{id}/overview

GET /projects/{id}/cashflow

GET /projects/{id}/documents

GET /projects/{id}/timeline

POST /projects/{id}/archive

POST /projects/{id}/close

⸻

AI Opportunities

Automatically extract project information from uploaded Work Orders.

Predict project completion dates.

Predict profit margin.

Detect abnormal spending.

Identify duplicate projects.

Summarize project health.

Suggest missing documents.

Generate weekly progress reports.

Answer natural language questions.

Example

“How much have we spent on steel for this project?”

⸻

Failure Modes

Duplicate Work Order uploaded.

OCR extracts wrong client.

Supplier bill linked to wrong project.

Project closed with unpaid suppliers.

Project archived with pending attendance.

Network interruption during creation.

The system must handle every failure gracefully.

⸻

Acceptance Criteria

A project can be created in under two minutes.

Every module links correctly to the project.

Financial values update automatically.

Timeline updates automatically.

Documents remain attached.

Permissions work correctly.

Project search returns accurate results.

All events are logged.

⸻

Future Enhancements

Project Templates

Recurring Projects

Project Cloning

Milestone Tracking

Task Management

Client Portal

Site Photo Timeline

GPS Tagged Updates

Voice Notes

Offline Site Mode

Budget Forecasting

Inventory Integration

Purchase Orders

Project Risk Score

AI Project Assistant

⸻

Definition of Done

The Project Workspace is complete when:

* Projects can be created, edited, archived and closed.
* Every financial event is linked to a project.
* Every document is linked to a project.
* Every labour record is linked to a project.
* The workspace provides a complete operational view without requiring users to navigate to other modules.
* All business rules, events, permissions and audit logs function correctly.