# Curas MVP - Project Brief

## 1) Business Context (Authoritative Requirements)

**Problem**: Paper-based equipment/trolley checks waste time, undermine compliance, and risk patient safety.

**Primary user**: Nurse Unit Manager (NUM). 
**Secondary**: nurses/clinical staff, biomedical technicians, administrators.

**Non-goals in MVP**: predictive analytics, native apps, deep enterprise integrations, full PM scheduler, AI copilots, multi-ward rollups, SSO.

**North Star**: Raise “Compliant & Available” time for critical equipment from 96.8% → ≥ 98.5%.

**12-month business targets (for future proofing)**: audit prep ≤ 6 hrs (-90%), PM on-time ≥ 95%, reduce critical device downtime ≤ 3.0 h/qtr, etc.

## 2) MVP Scope (Must-Have Functionality)

**A) Frontline Nurse (Daily Use)**
- One-tap checklist access by Ward → Checklist or QR/Asset ID.
- Standardised inputs: Yes/No/NA, required fields, user/timestamp attribution.
- Rapid fault logging with photo, symptom, severity → creates Issue Ticket linked to Asset.
- Immediate on-screen confirmations; retry queue offline.

**B) Nurse Unit Manager (Oversight)**
- Live Compliance Snapshot: today’s completion %, overdue, critical devices not checked.
- Ward Activity Log: immutable audit trail; CSV export.
- Basic alerts: checks past due, critical fault reported (in-app for MVP).

**C) Cross-Cutting**
- RBAC: NURSE, NUM (hard roles).
- Seed Asset Register: ID, type, location, status.
- Core Security: AuthN/AuthZ, rate-limits, input validation, S3 presigned uploads.

**Explicitly out of scope in MVP**
Predictive maintenance, enterprise SSO, deep integrations, full PM scheduler, multi-ward views, AI features, native apps.
