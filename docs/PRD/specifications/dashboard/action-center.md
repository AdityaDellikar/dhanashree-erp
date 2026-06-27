Dhanashree ERP

Action Center Specification

Version: 1.0

Status: Draft

Dependencies:

* Transaction Engine
* Cashflow Engine
* Workforce Management
* Document Management

⸻

Purpose

The Action Center is the owner’s daily command center.

It highlights tasks, risks, reminders and pending approvals that require attention.

⸻

Categories

Payments

* Supplier payment due
* Client payment pending
* Labour salary pending

⸻

Projects

* Daily Site Log missing
* Project paused
* Project nearing completion
* Low profit warning

⸻

Documents

* OCR review pending
* Missing Work Order
* Missing Invoice

⸻

Workforce

* Attendance not submitted
* Salary overdue

⸻

Alerts

* High miscellaneous expenses
* Negative cash position
* Duplicate invoice detected

⸻

Priority

Every item has a priority.

* Critical
* High
* Medium
* Low

Critical items always appear first.

⸻

Actions

Every notification includes an action.

Examples

Supplier Payment Due

→ Pay Now

Attendance Missing

→ Open Daily Site Log

OCR Pending

→ Review OCR

Client Payment Due

→ View Project

⸻

Auto Rules

Examples

If supplier balance > limit

→ Create High Priority Alert

If site log missing after 7 PM

→ Reminder

If project profit margin < target

→ Risk Alert

If OCR confidence < threshold

→ Manual Review

⸻

UI

Cards grouped by:

* Today
* This Week
* Upcoming

Each card shows:

* Title
* Project
* Amount (if applicable)
* Due Date
* Action Button

⸻

Events

* Action Created
* Action Completed
* Action Dismissed

⸻

APIs

GET /actions

POST /actions/{id}/complete

POST /actions/{id}/dismiss

⸻

Acceptance Criteria

* Displays all pending actions.
* Automatically updates.
* Prioritizes urgent work.
* Deep-links to related module.
* Mobile-friendly.

⸻

Future Improvements

* AI-generated recommendations
* WhatsApp reminders
* Email reminders
* Daily morning summary
* Smart prioritization
* Voice reminders