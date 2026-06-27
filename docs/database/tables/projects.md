Dhanashree ERP

Table Specification - Projects

Version: 1.0

Status: Draft

⸻

Purpose

The projects table is the root entity of the ERP.

Every operational activity (transactions, labour, suppliers, documents, site logs) belongs to a project.

⸻

Columns

Column	Type	Required	Description
id	UUID	Yes	Primary Key
company_id	UUID	Yes	Company Owner
client_id	UUID	Yes	Linked Client
code	VARCHAR(20)	Yes	Unique Project Code (e.g. DTC-2026-001)
name	TEXT	Yes	Project Name
description	TEXT	No	Internal Description
site_address	TEXT	Yes	Project Location
manager_id	UUID	No	Assigned Manager
contract_value	DECIMAL(12,2)	No	Agreed Contract Amount
start_date	DATE	Yes	Project Start Date
expected_end_date	DATE	No	Estimated Completion
actual_end_date	DATE	No	Actual Completion
status	TEXT	Yes	Draft, Active, Completed, Archived
progress_percentage	INTEGER	No	0–100 (manual for MVP)
notes	TEXT	No	Internal Notes
created_at	TIMESTAMP	Yes	Auto Generated
updated_at	TIMESTAMP	Yes	Auto Generated
archived_at	TIMESTAMP	No	Soft Archive

⸻

Relationships

Project belongs to:

* Company
* Client

Project has many:

* Transactions
* Documents
* Site Logs
* Attendance
* Labour Assignments
* Supplier Transactions

⸻

Constraints

* code must be unique.
* contract_value >= 0
* progress_percentage between 0 and 100.
* expected_end_date >= start_date
* Projects cannot be hard deleted.

⸻

Indexes

* company_id
* client_id
* manager_id
* status
* start_date
* code (unique)

⸻

Business Rules

* A project cannot exist without a client.
* A project code is generated automatically.
* Archived projects remain searchable.
* Closing a project prevents new financial transactions (unless reopened).

⸻

Events

* ProjectCreated
* ProjectUpdated
* ProjectArchived
* ProjectClosed

⸻

Notes

Financial values (profit, expenses, cash position) are not stored in this table. They are calculated by the Financial Calculator Service.