Dhanashree ERP

Cashflow Engine Specification

Version: 1.0

Status: Draft

Dependencies:

* Project Workspace
* Transaction Engine

⸻

Purpose

The Cashflow Engine provides a real-time financial view of every project.

It calculates project health using transactions instead of manually entered values.

Every financial card, dashboard metric and report uses this engine.

⸻

Objectives

Answer these questions instantly:

* How much money has the client paid?
* How much has been spent?
* How much is still receivable?
* How much is still payable?
* Is the project profitable?
* Where is money leaking?
* What are today’s expenses?

⸻

Core Metrics

Revenue

Total contract value.

Source:

Project / Work Order

⸻

Amount Received

Total money received from the client.

Source:

Income Transactions

⸻

Amount Spent

Total expenses.

Source:

Expense Transactions

⸻

Pending Client Payment

Formula

Contract Value

Amount Received

⸻

Pending Supplier Payment

Sum of unpaid supplier transactions.

⸻

Pending Labour Payment

Calculated from Labour module.

⸻

Miscellaneous Cost

Sum of all transactions in the Miscellaneous category.

Purpose:

Expose hidden costs.

⸻

Cash Position

Formula

Amount Received

Amount Spent

This answers:

“How much cash is currently available from this project?”

⸻

Estimated Profit

Formula

Contract Value

Total Expenses

⸻

Realized Profit

Formula

Amount Received

Amount Spent

⸻

Expense Breakdown

The engine should group expenses by category.

Categories

* Material
* Labour
* Transport
* Miscellaneous
* Fuel
* Equipment
* Accommodation
* Office
* Other

⸻

Hidden Cost Analysis

Display:

* Total Misc Cost
* Misc % of Total Expenses
* Top Misc Categories

Highlight unusually high miscellaneous spending.

⸻

Daily Cashflow

Track daily:

* Income
* Expenses
* Net Change

Support weekly and monthly views.

⸻

Project Health

Every project receives a health status.

Excellent

Good

Attention

Critical

Suggested factors:

* Negative cash position
* High pending payments
* Excessive misc costs
* Low profit margin

Health rules should remain configurable.

⸻

Dashboard Outputs

The Cashflow Engine provides data to:

* Dashboard
* Project Workspace
* Analytics
* Reports
* AI Assistant

No module performs its own financial calculations.

⸻

Events

Recalculate when:

* Transaction Created
* Transaction Updated
* Transaction Reversed
* Salary Paid
* Supplier Paid
* Client Payment Received
* Project Updated

⸻

APIs

GET /projects/{id}/cashflow

GET /cashflow/summary

GET /cashflow/daily

GET /cashflow/monthly

⸻

Validation

* Ignore archived transactions.
* Ignore reversed transactions.
* Prevent duplicate calculations.
* Recalculate automatically after every financial event.

⸻

UI Requirements

Project Cashflow Card

Display:

* Contract Value
* Received
* Spent
* Pending Client Payment
* Pending Supplier Payment
* Pending Labour Payment
* Cash Position
* Estimated Profit

Company Dashboard

Display:

* Total Revenue
* Total Received
* Total Expenses
* Current Cash Position
* Today’s Expenses
* Today’s Income

⸻

Acceptance Criteria

* Metrics update automatically.
* No manual calculations.
* Supports multiple projects.
* Hidden costs are visible.
* Dashboard reflects latest transactions.

⸻

Future Improvements

* Profit forecasting
* Cashflow forecasting
* Monthly burn rate
* Budget alerts
* AI anomaly detection
* Financial recommendations
* What-if simulations
* GST impact analysis