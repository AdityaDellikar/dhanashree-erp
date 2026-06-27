Dhanashree ERP

DATABASE.md

Version: 1.0

Database: PostgreSQL (Supabase)

⸻

Core Tables

companies

Stores company information.

Column	Type
id	UUID
name	TEXT
created_at	TIMESTAMP

⸻

users

Authenticated users.

Column	Type
id	UUID
company_id	UUID
name	TEXT
email	TEXT
role	TEXT

Roles

* Owner
* Manager
* Accountant

⸻

clients

Customer information.

Column	Type
id	UUID
company_id	UUID
name	TEXT
phone	TEXT
address	TEXT

⸻

projects

Project workspace.

Column	Type
id	UUID
company_id	UUID
client_id	UUID
code	TEXT
name	TEXT
stage	TEXT
status	TEXT
contract_value	DECIMAL
start_date	DATE
expected_end_date	DATE

⸻

suppliers

Supplier directory.

Column	Type
id	UUID
company_id	UUID
name	TEXT
supplier_type	TEXT
phone	TEXT
gst	TEXT

⸻

labours

Labour directory.

Column	Type
id	UUID
company_id	UUID
name	TEXT
phone	TEXT
daily_wage	DECIMAL
status	TEXT

⸻

attendance

Daily attendance.

Column	Type
id	UUID
project_id	UUID
labour_id	UUID
date	DATE
attendance_type	TEXT

⸻

site_logs

Daily site reports.

Column	Type
id	UUID
project_id	UUID
date	DATE
notes	TEXT
created_by	UUID

⸻

transactions

Financial source of truth.

Column	Type
id	UUID
project_id	UUID
supplier_id	UUID
labour_id	UUID
category	TEXT
type	TEXT
amount	DECIMAL
payment_method	TEXT
transaction_date	DATE
description	TEXT

⸻

payments

Payment history.

Column	Type
id	UUID
transaction_id	UUID
amount	DECIMAL
payment_method	TEXT
payment_date	DATE

⸻

documents

Uploaded files.

Column	Type
id	UUID
project_id	UUID
transaction_id	UUID
type	TEXT
file_url	TEXT
uploaded_by	UUID

⸻

ocr_results

OCR extraction.

Column	Type
id	UUID
document_id	UUID
status	TEXT
extracted_json	JSONB
confidence	DECIMAL

⸻

notifications

Action Center.

Column	Type
id	UUID
project_id	UUID
priority	TEXT
title	TEXT
action_url	TEXT
completed	BOOLEAN

⸻

audit_logs

History.

Column	Type
id	UUID
user_id	UUID
entity	TEXT
entity_id	UUID
action	TEXT
created_at	TIMESTAMP

⸻

categories

Configurable transaction categories.

Column	Type
id	UUID
name	TEXT
type	TEXT

⸻

Relationships

Company

├── Users

├── Clients

├── Projects

├── Suppliers

└── Labours

Project

├── Site Logs

├── Transactions

├── Documents

└── Attendance

Transaction

├── Payments

└── Documents

Document

└── OCR Result

Labour

└── Attendance

⸻

Rules

* UUID Primary Keys
* Soft Delete
* created_at
* updated_at
* RLS Enabled
* No Calculated Values Stored
* Audit Every Financial Change