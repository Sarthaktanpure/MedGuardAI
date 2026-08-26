# MedGuard

MedGuard is being scaffolded as an offline-first medicine verification platform with a multi-page MERN website and Python services for ML and blockchain.
The repo now uses a MERN-style website stack:

- `backend/` is the Node + Express + Mongo API.
- `frontend/` is the React + Vite client.
- `AI_Modules/` is the Python ML service scaffold.
- `BlockChain/` is the Python blockchain integration scaffold.

## Current scaffold

- `frontend/` contains the React + Vite multi-page site.
- `backend/` contains the Express + Mongo bootstrap API.
- `AI_Modules/` contains the Python ML service shell.
- `BlockChain/` contains the Python blockchain service shell.
- `infra/docker-compose.yml` wires the local stack together.
- `docs/` contains the starter architecture and model card notes.

## Quick start

1. Copy `.env.example` to `.env`.
2. Start the API:
   - `npm --prefix backend run dev`
3. Start the web app:
   - `npm --prefix frontend run dev`

For containerized dev, use `docker compose -f infra/docker-compose.yml up --build`.

For a production-style run, use `docker compose -f infra/docker-compose.prod.yml up --build`.
