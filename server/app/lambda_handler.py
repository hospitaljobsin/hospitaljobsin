# from mangum import Mangum

# from app import create_app

# app = create_app()
# handler = Mangum(app, lifespan="auto")


from mangum import Mangum


async def app(scope, receive, send):
    await send(
        {
            "type": "http.response.start",
            "status": 200,
            "headers": [[b"content-type", b"text/plain; charset=utf-8"]],
        }
    )
    await send({"type": "http.response.body", "body": b"Hello, world!"})


handler = Mangum(app, lifespan="off")
