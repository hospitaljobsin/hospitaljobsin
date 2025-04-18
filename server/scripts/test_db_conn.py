import os

import pymongo
from motor.motor_asyncio import AsyncIOMotorClient

os.environ["AWS_ACCESS_KEY_ID"] = "AKIA5X3Q4Z2J6F7K3G2A"
os.environ["AWS_SECRET_ACCESS_KEY"] = "h4j7x3Q4Z2J6F7K3G2A"
os.environ["AWS_REGION"] = "us-east-1"

database_url = "mongodb+srv://hj-cluster.60gzjcp.mongodb.net/?authMechanism=MONGODB-AWS&authSource=$external"
client = pymongo.MongoClient(database_url)


async_client = AsyncIOMotorClient(
    database_url,
    connectTimeoutMS=1000,
    socketTimeoutMS=1000,
    serverSelectionTimeoutMS=1000,
)


client.get_default_database("medicaljobs")
