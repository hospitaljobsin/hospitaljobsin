from mangum import Mangum

from app import create_app

app = create_app()
handler = Mangum(app, lifespan="auto")

# from collections.abc import AsyncGenerator
# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from mangum import Mangum


# @asynccontextmanager
# async def app_lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
#     """Initialize the database when the app starts."""
#     print("before app start")
#     yield
#     print("after app stop")


# app = FastAPI()


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str = None):
#     return {"item_id": item_id, "q": q}


# handler = Mangum(app, lifespan="on")
