from fastapi import FastAPI

app = FastAPI(title="MedGuard Blockchain Service", version="0.1.0")


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "blockchain"}


@app.post("/batches/register")
async def register_batch() -> dict[str, str]:
    return {
        "status": "stubbed",
        "detail": "Python blockchain integration scaffolding will be filled in later.",
    }
