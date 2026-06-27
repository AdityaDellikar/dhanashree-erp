Dhanashree ERP

Workforce Management Specification

Version: 1.0

Status: Draft

Dependencies:

* Project Workspace
* Transaction Engine
* Cashflow Engine

⸻

Purpose

Manage labour, attendance, salary calculations, advances and payments.

Attendance is the source of truth.

Salary is generated from attendance.

⸻

Core Features

* Labour Directory
* Attendance
* Salary Calculator
* Advances
* Payments
* Labour History

⸻

Labour Profile

Each labour has:

* Name
* Phone Number
* Daily Wage
* Skill Type
* Joining Date
* Status (Active/Inactive)

Optional

* Aadhaar
* Emergency Contact
* Notes

⸻

Attendance

Daily attendance supports:

* Full Day
* Half Day
* Night Shift
* Sunday Shift
* Leave
* Absent

Attendance belongs to:

* Project
* Labour
* Date

⸻

Salary Calculation

Salary is calculated automatically.

Formula

Working Days × Daily Wage
+ Night Bonus
+ Sunday Bonus
- Advances
= Salary Due

No manual salary calculation.

⸻

Advances

Allow advance payments before salary.

Fields

* Amount
* Date
* Reason
* Notes

Advances reduce salary due.

⸻

Salary Payment

Record:

* Amount Paid
* Date
* Payment Method
* Notes

Creates:

* Transaction
* Cashflow Update
* Audit Log

⸻

Labour Dashboard

Display

* Active Labour
* Today’s Attendance
* Salary Due
* Advances
* Monthly Cost

⸻

Filters

* Project
* Labour
* Date
* Active
* Salary Pending

⸻

Events

* Labour Added
* Attendance Recorded
* Attendance Updated
* Advance Given
* Salary Calculated
* Salary Paid

⸻

APIs

GET /labours

POST /labours

POST /attendance

GET /attendance

POST /salary/pay

GET /salary

⸻

Validation

* Attendance only once per labour per day.
* Daily wage > 0.
* Salary payment cannot exceed salary due.
* Advance cannot exceed configurable limit (optional).

⸻

UI

Labour List

* Search
* Filters
* Quick Add

Attendance Screen

* Mobile-first
* One-tap attendance
* Bulk marking

Salary Screen

* Auto-calculated
* Show pending amount
* Pay button

⸻

Acceptance Criteria

* Labour can be added.
* Attendance recorded in under 30 seconds.
* Salary auto-calculated.
* Salary payment creates transaction.
* Cashflow updates automatically.

⸻

Future Improvements

* Face recognition attendance
* GPS attendance
* QR attendance
* Voice attendance
* Weekly payroll
* Labour performance
* Productivity metrics
* Attendance reminders