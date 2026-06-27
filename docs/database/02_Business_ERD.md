Dhanashree ERP

Business Entity Relationship Model (Business ERD)

Version: 1.0

Status: Draft

⸻

Purpose

Define how business entities relate to each other before designing database tables.

This document represents the business model, not the database schema.

⸻

Core Business Flow

graph TD
Client --> Project
Project --> SiteLog
Project --> Transaction
Project --> Supplier
Project --> Labour
Project --> Document
Transaction --> Payment
Labour --> Attendance
SiteLog --> Attendance
SiteLog --> Transaction
Document --> OCR
OCR --> Transaction
Transaction --> Cashflow
Cashflow --> Dashboard
Cashflow --> Analytics
Cashflow --> Reports
Dashboard --> ActionCenter

⸻

Entity Responsibilities

Client

Owns one or more Projects.

⸻

Project

The central workspace.

Everything belongs to a Project.

⸻

Site Log

Represents one working day.

Creates:

* Attendance
* Transactions
* Notes
* Photos

⸻

Labour

Represents workers.

Attendance belongs to Labour.

⸻

Attendance

Daily work records.

Used to calculate salary.

⸻

Supplier

Provides materials or services.

Transactions reference Suppliers.

⸻

Transaction

Represents every movement of money.

The financial source of truth.

⸻

Payment

Settles Transactions.

⸻

Document

Stores uploaded files.

Supports OCR.

⸻

OCR

Extracts structured information.

Never directly modifies business data.

Creates draft suggestions.

⸻

Cashflow

Calculated from Transactions and Payments.

Never stored.

⸻

Dashboard

Visualizes calculated business metrics.

⸻

Action Center

Shows pending work generated from business rules.

⸻

Design Principles

* One Project owns many business records.
* One Site Log represents one day.
* One Transaction represents one financial event.
* One Payment settles one or more Transactions.
* Documents provide evidence.
* Cashflow is calculated.
* Dashboards never calculate independently.