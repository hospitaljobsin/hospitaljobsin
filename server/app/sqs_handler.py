# sqs_handler.py
import json


def lambda_handler(event, context):
    for record in event["Records"]:
        body = json.loads(record["body"])

        # Access DB and perform analysis
        # with get_session() as db:
        #     analyze_profile(db=db, profile_data=body)

    return {"status": "ok"}
