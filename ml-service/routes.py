from fastapi import APIRouter

router = APIRouter()


@router.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "ml-service"}


@router.post("/train")
async def train() -> dict[str, str]:
    return {"status": "queued", "detail": "training pipeline scaffold"}


@router.get("/models/{version}/eval")
async def model_eval(version: str) -> dict[str, str]:
    return {"version": version, "status": "scaffold"}
