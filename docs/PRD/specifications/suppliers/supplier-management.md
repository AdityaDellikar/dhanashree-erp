Dhanashree ERP

Supplier Management Specification

Version: 1.0

Status: Draft

Dependencies:

* Project Workspace
* Transaction Engine
* Cashflow Engine

⸻

Purpose

Manage suppliers, purchases, payments and outstanding balances.

Supplier balances are calculated from transactions.

⸻

Core Features

* Supplier Directory
* Purchase History
* Outstanding Balance
* Payment History
* Supplier Documents

⸻

Supplier Profile

Required

* Supplier Name
* Phone Number

Optional

* GST Number
* Address
* Email
* Contact Person
* Bank Details
* UPI ID
* Notes

⸻

Purchase Recording

Each purchase stores:

* Project
* Supplier
* Amount
* Category
* Date
* Description
* Attachment

Creates:

* Expense Transaction
* Supplier Ledger Entry

⸻

Payments

Record

* Amount
* Date
* Payment Method
* Reference Number
* Notes

Creates:

* Payment Record
* Transaction
* Cashflow Update

⸻

Supplier Dashboard

Display

* Total Purchased
* Total Paid
* Outstanding Balance
* Last Purchase
* Last Payment
* Active Projects

⸻

Search & Filters

Search

* Supplier Name
* GST Number
* Phone

Filters

* Outstanding
* Fully Paid
* Recent Purchases

⸻

Business Rules

* Supplier cannot be deleted if transactions exist.
* Outstanding balance is calculated.
* Payments cannot exceed outstanding balance.
* Every purchase belongs to a project.

⸻

Events

* Supplier Created
* Purchase Recorded
* Payment Recorded
* Supplier Updated

⸻

APIs

GET /suppliers

POST /suppliers

GET /suppliers/{id}

POST /suppliers/{id}/payment

GET /suppliers/{id}/ledger

⸻

Validation

Required

* Supplier Name
* Purchase Amount
* Project

Reject

* Negative amount
* Invalid supplier
* Payment exceeding balance

⸻

UI

Supplier List

* Search
* Outstanding badge
* Quick Add

Supplier Detail

* Overview
* Ledger
* Purchases
* Payments
* Documents

⸻

Acceptance Criteria

* Add supplier.
* Record purchase.
* Record payment.
* Ledger updates automatically.
* Outstanding balance calculated correctly.

⸻

Future Improvements

* Supplier rating
* Purchase trends
* Auto-reminders
* Payment due alerts
* UPI deep-link payment
* GST reconciliation
* AI duplicate invoice detection