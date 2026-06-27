Dhanashree ERP

Transaction Engine Specification

Version: 1.0

Status: Draft

Dependencies:

* Project Workspace
* Business Domain
* Event Model

⸻

Purpose

The Transaction Engine is the single source of truth for all financial activity in the system.

Every movement of money must create a transaction.

⸻

Supported Transaction Types

Income

* Client Advance
* Client Payment
* Refund
* Adjustment

Expense

* Material Purchase
* Labour Salary
* Labour Advance
* Transport
* Miscellaneous
* Fuel
* Equipment
* Accommodation
* Office Expense
* Supplier Payment

⸻

Transaction Structure

Required Fields

* Project
* Transaction Type
* Category
* Amount
* Date
* Payment Method

Optional

* Supplier
* Labour
* Description
* Notes
* Attachment
* Reference Number

⸻

Transaction Categories

Material

Labour

Transport

Miscellaneous

Fuel

Equipment

Accommodation

Office

Client Payment

Refund

Adjustment

Categories should be configurable in Settings.

⸻

Transaction Flow

Create Transaction
↓
Validate
↓
Save
↓
Emit Event
↓
Update Cashflow
↓
Update Dashboard
↓
Update Analytics
↓
Audit Log

⸻

Business Rules

* Every transaction belongs to one project unless marked as a company expense.
* Amount must be greater than zero.
* Transactions cannot be permanently deleted.
* Corrections require reversal or adjustment entries.
* Every transaction is timestamped.
* Attachments are optional but recommended.

⸻

Filters

Users should filter by:

* Project
* Date Range
* Category
* Supplier
* Labour
* Payment Method
* Amount
* Type (Income/Expense)

⸻

Search

Support searching by:

* Description
* Reference Number
* Supplier
* Labour
* Project

⸻

Payment Methods

* Cash
* Bank Transfer
* UPI
* Cheque
* Credit

Future methods can be added from Settings.

⸻

Attachments

A transaction may contain:

* Invoice
* Bill
* Receipt
* Photo

Multiple attachments should be supported.

⸻

Events

* Transaction Created
* Transaction Updated
* Transaction Reversed
* Attachment Added

⸻

APIs

GET /transactions

POST /transactions

GET /transactions/{id}

PATCH /transactions/{id}

POST /transactions/{id}/reverse

⸻

Validation

Required:

* Project
* Type
* Category
* Amount
* Date

Reject:

* Negative amount
* Missing project (unless company expense)
* Invalid category

⸻

UI Requirements

Transaction List

* Search
* Filters
* Sort
* Quick Add
* Bulk Import (Future)

Transaction Detail

* Overview
* Attachments
* Audit History
* Related Project

Quick Add Modal

* Mobile-first
* Less than 30 seconds to complete

⸻

Acceptance Criteria

* Create income and expense transactions.
* Attach documents.
* Link to projects.
* Automatically update downstream modules.
* Full audit history.
* Mobile-friendly workflow.

⸻

Future Improvements

* OCR auto-create transactions
* Recurring transactions
* Bulk import from Excel
* AI category suggestions
* Duplicate detection
* Voice transaction entry