import os

import pymongo

os.environ["AWS_ACCESS_KEY_ID"] = "AKIA5X3Q4Z2J6F7K3G2A"
os.environ["AWS_SECRET_ACCESS_KEY"] = "h4j7x3Q4Z2J6F7K3G2A"
os.environ["AWS_REGION"] = "us-east-1"

pymongo.MongoClient(
    "mongodb+srv://hj-cluster.60gzjcp.mongodb.net/?authMechanism=MONGODB-AWS&authSource=$external",
)
