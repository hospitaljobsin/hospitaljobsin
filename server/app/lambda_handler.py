from mangum import Mangum

from app import create_app

app = create_app()
handler = Mangum(app, lifespan="off")
