from fastapi import FastAPI

from routes import router

app = FastAPI(title="MedGuard ML Service", version="0.1.0")
app.include_router(router)
