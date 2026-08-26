# Architecture

This repository is being built as a monorepo scaffold for MedGuard.

## Phase 1 layout

- `backend/` is the Node + Express + Mongo website API.
- `frontend/` is the browser client, organized as a multi-page React site.
- `AI_Modules/` is the Python ML service.
- `BlockChain/` is the Python blockchain integration layer.
- `infra/docker-compose.yml` brings up the local stack.
- `docs/MODEL_CARD.md` will eventually document the ML pipeline and evaluation history.

## Current guarantees

- Health checks exist for both the backend and the frontend pages.
- The frontend pages can run independently of the API and will show backend connectivity when the API is available.
- The API is stateless at this stage and exposes boot, health, and page-serving endpoints.
- The production backend image builds the frontend pages and serves them directly from Express.
