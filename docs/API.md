# Dhanashree ERP

# API Reference

Version: 1.0

---

# Principles

- RESTful endpoints
- JSON request/response
- Auth required unless specified
- Validate using Zod
- Business logic lives in Services

---

# Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/login |
| POST | /api/auth/logout |
| GET | /api/auth/me |

---

# Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/dashboard |
| GET | /api/dashboard/activity |
| GET | /api/dashboard/actions |

---

# Projects

| Method | Endpoint |
|---------|----------|
| GET | /api/projects |
| GET | /api/projects/:id |
| POST | /api/projects |
| PATCH | /api/projects/:id |
| POST | /api/projects/:id/archive |
| POST | /api/projects/:id/close |

---

# Transactions

| Method | Endpoint |
|---------|----------|
| GET | /api/transactions |
| GET | /api/transactions/:id |
| POST | /api/transactions |
| PATCH | /api/transactions/:id |
| POST | /api/transactions/:id/reverse |

---

# Payments

| Method | Endpoint |
|---------|----------|
| GET | /api/payments |
| POST | /api/payments |

---

# Workforce

## Labour

| Method | Endpoint |
|---------|----------|
| GET | /api/labours |
| POST | /api/labours |
| PATCH | /api/labours/:id |

## Attendance

| Method | Endpoint |
|---------|----------|
| GET | /api/attendance |
| POST | /api/attendance |

## Salary

| Method | Endpoint |
|---------|----------|
| GET | /api/salary |
| POST | /api/salary/pay |

---

# Site Logs

| Method | Endpoint |
|---------|----------|
| GET | /api/site-logs |
| POST | /api/site-logs |

---

# Suppliers

| Method | Endpoint |
|---------|----------|
| GET | /api/suppliers |
| POST | /api/suppliers |
| GET | /api/suppliers/:id |
| POST | /api/suppliers/:id/payment |

---

# Documents

| Method | Endpoint |
|---------|----------|
| GET | /api/documents |
| POST | /api/documents |
| GET | /api/documents/:id |
| POST | /api/documents/:id/ocr |
| POST | /api/documents/:id/confirm |

---

# Analytics

| Method | Endpoint |
|---------|----------|
| GET | /api/analytics/company |
| GET | /api/analytics/project/:id |

---

# Reports

| Method | Endpoint |
|---------|----------|
| GET | /api/reports/company |
| GET | /api/reports/project/:id |
| GET | /api/reports/labour |
| GET | /api/reports/suppliers |

---

# AI

| Method | Endpoint |
|---------|----------|
| POST | /api/ai/chat |
| POST | /api/ai/ocr |
| POST | /api/ai/summarize |

---

# Standard Response

Success

```json
{
  "success": true,
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "",
  "errors": []
}
```