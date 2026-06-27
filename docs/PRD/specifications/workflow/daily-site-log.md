Dhanashree ERP

Daily Site Log Specification

Version: 1.0

Status: Draft

Dependencies:

* Project Workspace
* Workforce Management
* Transaction Engine
* Cashflow Engine

⸻

Purpose

The Daily Site Log is the primary workflow for site managers.

Instead of entering data across multiple modules, managers submit one daily report containing all operational information.

⸻

Goal

Complete daily reporting in under 5 minutes.

⸻

Daily Workflow

Open Project
↓
Today's Site Log
↓
Fill Details
↓
Submit
↓
System Updates Everything

⸻

Sections

1. Attendance

Record:

* Present
* Half Day
* Night Shift
* Sunday
* Leave
* Absent

Bulk selection supported.

⸻

2. Expenses

Quick Add

Fields

* Category
* Amount
* Description

Categories

* Material
* Misc
* Fuel
* Transport
* Equipment
* Food
* Other

⸻

3. Material Purchases

Record

* Supplier
* Material
* Quantity
* Amount

Optional invoice upload.

⸻

4. Miscellaneous

Quick buttons

* Tea
* Water
* Screws
* Nails
* Petrol
* Auto
* Parking

Custom option available.

⸻

5. Site Progress

Simple text update.

Example

“Completed east elevation framing.”

⸻

6. Photos

Upload

* Progress Photos
* Bills
* Receipts

Multiple uploads supported.

⸻

7. Notes

Free text.

Example

“Need additional sheets tomorrow.”

⸻

Submit Action

Submitting the log automatically:

* Saves attendance
* Creates expense transactions
* Updates cashflow
* Uploads documents
* Updates project timeline
* Creates audit log

No manual syncing required.

⸻

Events

* Site Log Created
* Attendance Recorded
* Expenses Added
* Photos Uploaded
* Timeline Updated

⸻

APIs

POST /site-log

GET /site-log/{project}

GET /site-log/{date}

⸻

Validation

* Project required
* Date required
* Duplicate daily logs require confirmation
* Expenses require amount > 0

⸻

UI

Single mobile page.

Large buttons.

Minimal typing.

Expandable sections.

One Submit button.

⸻

Acceptance Criteria

* Daily report completed in under 5 minutes.
* One submission updates all dependent modules.
* Mobile-friendly.
* Offline draft support (future).

⸻

Future Improvements

* Voice notes
* Offline mode
* GPS check-in
* Weather integration
* AI-generated daily summary
* WhatsApp export
* Daily PDF report