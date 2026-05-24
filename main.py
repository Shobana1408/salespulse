from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import Base, engine
from routes import router

app = FastAPI(
    title="SalesPulse API",
    description="Simple Full-Stack Sales Analytics App",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Welcome to SalesPulse API"
    }