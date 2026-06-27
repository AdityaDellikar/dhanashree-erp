Dhanashree ERP

Document Management & OCR Specification

Version: 1.0

Status: Draft

Dependencies:

* Project Workspace
* Transaction Engine
* Supplier Management

⸻

Purpose

Store all project-related documents and use AI/OCR to reduce manual data entry.

Documents are permanent records.

OCR assists the user but never makes automatic financial changes.

⸻

Supported Documents

* Work Orders
* Quotations
* GST Invoices
* Bills
* Receipts
* Delivery Challans
* Site Photos
* Completion Photos
* Other PDFs

⸻

Upload Sources

* Camera
* Gallery
* PDF Upload
* Drag & Drop (Desktop)

⸻

Document Fields

Required

* Project
* Document Type
* Upload Date

Optional

* Supplier
* Notes
* Tags
* Related Transaction

⸻

OCR Workflow

Upload Document
↓
Store Original File
↓
Run OCR
↓
Extract Data
↓
Create Draft
↓
User Reviews
↓
Confirm
↓
Create Records

⸻

OCR Extraction

Work Order

Extract

* Client
* Project Name
* Site Address
* Contract Value
* Scope
* Start Date

Suggest:

Create Project

⸻

Supplier Invoice

Extract

* Supplier
* Invoice Number
* Invoice Date
* Amount
* GST
* Items

Suggest:

Create Expense Transaction

⸻

Receipt

Extract

* Amount
* Date
* Payment Method

Suggest:

Link to Transaction

⸻

Quotation

Extract

* Client
* Amount
* Scope
* Validity

Suggest:

Create Quotation Record

⸻

User Confirmation

Before saving, display:

Detected Supplier

Detected Amount

Detected Date

Detected Project

Detected Category

Buttons

* Confirm
* Edit
* Cancel

⸻

Search

Search by

* Project
* Supplier
* Document Type
* Date
* OCR Text

⸻

Filters

* Work Orders
* Bills
* Receipts
* Photos
* Quotations

⸻

Business Rules

* Original document is never modified.
* OCR results are editable.
* Documents cannot be permanently deleted.
* Multiple documents can belong to one transaction.
* One document can relate to multiple records if required.

⸻

Events

* Document Uploaded
* OCR Started
* OCR Completed
* Draft Created
* Draft Confirmed

⸻

APIs

POST /documents

GET /documents

GET /documents/{id}

POST /documents/{id}/ocr

POST /documents/{id}/confirm

⸻

Validation

* Project required.
* File type supported.
* OCR confidence below threshold requires manual review.
* Duplicate documents generate warning.

⸻

UI

Document Library

* Grid/List View
* Search
* Filters
* Preview

Document Detail

* Preview
* OCR Results
* Related Records
* Download

OCR Review Screen

* Original Document
* Extracted Fields
* Editable Form
* Confirm Button

⸻

Acceptance Criteria

* Upload documents.
* OCR extracts data.
* User reviews before saving.
* Related records created after confirmation.
* Original files preserved.

⸻

Future Improvements

* Multi-page OCR
* Handwritten note recognition
* AI document categorization
* Duplicate invoice detection
* Auto-project matching
* Voice document search
* Bulk uploads
* Email-to-project import