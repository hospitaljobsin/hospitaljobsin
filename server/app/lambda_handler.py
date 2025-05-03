# from mangum import Mangum

# from app import create_app

# app = create_app()
# handler = Mangum(app, lifespan="auto")

from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


handler = Mangum(app, lifespan="off")
