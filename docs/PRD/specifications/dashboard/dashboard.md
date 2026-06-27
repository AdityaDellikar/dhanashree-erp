Dhanashree ERP

Dashboard Specification

Version: 1.0

Status: Draft

Dependencies:

* Action Center
* Cashflow Engine
* Project Workspace

⸻

Purpose

The Dashboard is the owner’s command center.

It provides an instant overview of the company’s financial health, active projects and pending actions.

⸻

Dashboard Layout

1. Welcome Header
2. Action Center
3. Today’s Cashflow
4. Business Summary
5. Active Projects
6. Quick Actions
7. Recent Activity

⸻

1. Welcome Header

Display

* Company Name
* Current Date
* Greeting

Example

Good Morning
Dhanashree Trading Company

⸻

2. Action Center

Display

* Critical Alerts
* Pending Approvals
* Payment Reminders

Maximum 5 items.

⸻

3. Today’s Cashflow

Display

* Money Received
* Money Spent
* Net Cash Today

⸻

4. Business Summary

Display

* Active Projects
* Total Receivable
* Total Payable
* Current Cash Position
* Estimated Profit

Tap any card to view details.

⸻

5. Active Projects

Each project card shows

* Project Name
* Client
* Status
* Today’s Expense
* Amount Received
* Progress

Tap opens Project Workspace.

⸻

6. Quick Actions

Buttons

* New Project
* Daily Site Log
* Add Expense
* Record Payment
* Upload Document

⸻

7. Recent Activity

Latest events

* Payment Received
* Invoice Uploaded
* Salary Paid
* Site Log Submitted
* New Supplier Added

⸻

Search

Global Search

Supports

* Projects
* Suppliers
* Labour
* Transactions
* Documents

⸻

Business Rules

* Dashboard is read-only.
* All values come from backend services.
* No manual calculations.

⸻

APIs

GET /dashboard

GET /dashboard/summary

GET /dashboard/activity

⸻

Acceptance Criteria

* Loads in under 2 seconds.
* Mobile-first layout.
* Displays latest business state.
* Quick Actions accessible within one tap.
* Active Projects open Project Workspace.