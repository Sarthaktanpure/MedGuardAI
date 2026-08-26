# MedGuard Shared Foundation

This file is the shared contract for all MedGuard services.

It is intentionally opinionated and keeps the backend, ML service, contracts, and infra aligned while the React client is being built separately.

## 1. Product Scope

MedGuard is a medicine verification platform with:

- A backend API for auth, scans, batches, analytics, administration, and model orchestration
- A training and export service for the ML pipeline
- A Solidity contract for batch registration and flagging
- Shared types and artifacts consumed by the backend and client

## 2. Shared Conventions

- API base path: `/api/v1`
- JSON request and response bodies
- Error responses use a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": []
  }
}
```

- All timestamps are ISO 8601 strings in UTC
- IDs are stringified MongoDB ObjectIds unless otherwise noted

## 3. Core Domain Model

The following entities are required by the scaffold.

- `User`
- `RefreshToken`
- `Scan`
- `ScanFlag`
- `Batch`
- `ModelVersion`
- `AnalyticsSnapshot`
- `AuditLog`

## 4. Data Models

### User

- `_id`
- `email`
- `passwordHash`
- `role`
- `displayName`
- `isActive`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

### RefreshToken

- `_id`
- `userId`
- `tokenHash`
- `expiresAt`
- `revokedAt`
- `createdAt`

### Scan

- `_id`
- `userId`
- `batchId`
- `imageObjectKey`
- `imageMimeType`
- `result`
- `confidence`
- `camSummary`
- `flagged`
- `flagReason`
- `createdAt`
- `updatedAt`

### Batch

- `_id`
- `batchKey`
- `metadataHash`
- `chainTxHash`
- `chainStatus`
- `flagged`
- `createdBy`
- `createdAt`
- `updatedAt`

### ModelVersion

- `_id`
- `version`
- `status`
- `metrics`
- `artifactObjectKey`
- `sourceEvalReport`
- `createdAt`
- `updatedAt`

## 5. API Contract

All backend routes live under `/api/v1`.

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Scans

- `POST /scans`
- `GET /scans`
- `GET /scans/:id`
- `POST /scans/:id/flag`

### Tracking

- `GET /tracking/:trackingId`
- `POST /tracking/events`

### Batches

- `POST /batches`
- `GET /batches`
- `GET /batches/:id`
- `POST /batches/:id/flag`

### Analytics

- `GET /analytics/overview`
- `GET /analytics/scans`
- `GET /analytics/batches`

### Models

- `GET /models`
- `GET /models/:version`
- `POST /models/retrain`

### Admin

- `GET /admin/users`
- `PATCH /admin/users/:id`
- `GET /admin/audit-logs`

### Health

- `GET /healthz`
- `GET /readyz`

## 6. Role Rules

- `public`: health endpoints
- `user`: scan and batch creation/read endpoints for own records
- `admin`: analytics, admin, and model orchestration endpoints

## 7. Notes

- This document is the contract source of truth for scaffolding.
- As the implementation matures, route request/response details can be expanded here without changing the shared shape.
- The current SPA scan flow is camera-first.
