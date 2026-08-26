from fastapi import FastAPI

app = FastAPI(title="MedGuard ML Service", version="0.1.0")


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "ml"}


@app.post("/train")
async def train() -> dict[str, str]:
    return {
        "status": "queued",
        "detail": "ML training scaffolding will be added in a later phase.",
    }
