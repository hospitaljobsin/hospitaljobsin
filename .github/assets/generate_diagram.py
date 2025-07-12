from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import ECR, Lambda
from diagrams.aws.engagement import SimpleEmailServiceSes
from diagrams.aws.general import User
from diagrams.aws.integration import SQS
from diagrams.aws.management import Cloudwatch
from diagrams.aws.network import APIGateway, CloudFront, Route53
from diagrams.aws.storage import S3
from diagrams.onprem.database import Mongodb
from diagrams.onprem.inmemory import Redis

with Diagram("System Architecture", show=False, direction="TB"):
    user = User("End User")
    route53 = Route53("AWS Route53 DNS")
    user >> route53

    with Cluster("Frontend", direction="LR"):
        with Cluster("hospitaljobs.in\n(Seeker Portal)", direction="RL"):
            cf_seeker = CloudFront("AWS CloudFront")
            seeker_server = Lambda("Next.js Server")
            image_opt = Lambda("Image Optimizer")
            static_assets = S3("Static Assets")
            cf_seeker >> seeker_server
            cf_seeker >> image_opt
            cf_seeker >> static_assets

        with Cluster("recruiter.hospitaljobs.in\n(Recruiter Portal)", direction="RL"):
            cf_recruiter = CloudFront("AWS CloudFront")
            recruiter_server = Lambda("Next.js Server")
            image_opt = Lambda("Image Optimizer")
            static_assets = S3("Static Assets")
            cf_recruiter >> recruiter_server

        with Cluster("*.hospitaljobs.in\n(Recruiter Dashboard)", direction="RL"):
            cf_dashboard = CloudFront("AWS CloudFront")
            dashboard_server = Lambda("Next.js Server")
            image_opt = Lambda("Image Optimizer")
            static_assets = S3("Static Assets")
            cf_dashboard >> dashboard_server

        with Cluster("accounts.hospitaljobs.in\n(Accounts UI)", direction="RL"):
            cf_accounts = CloudFront("AWS CloudFront")
            accounts_server = Lambda("Next.js Server")
            image_opt = Lambda("Image Optimizer")
            static_assets = S3("Static Assets")
            cf_accounts >> accounts_server

        route53 >> cf_seeker
        route53 >> cf_recruiter
        route53 >> cf_dashboard
        route53 >> cf_accounts

    # All frontends access the backend API
    api_gateway = APIGateway("api.hospitaljobs.in\nAPI Gateway V2")
    seeker_server >> api_gateway
    recruiter_server >> api_gateway
    dashboard_server >> api_gateway
    accounts_server >> api_gateway

    cloudwatch = Cloudwatch("AWS Cloudwatch")

    # API Gateway routes to Python Lambda (FastAPI GraphQL)
    with Cluster("Backend", direction="LR"):
        # SQS and async Lambda
        sqs = SQS("SQS Queue")

        mongo = Mongodb("MongoDB (Primary DB)\nMongoDB Atlas")
        redis = Redis("Redis (Cache)\nRedis Labs")
        py_lambda = Lambda("Python Lambda\nFastAPI GraphQL")
        api_gateway >> py_lambda

        py_lambda >> mongo
        py_lambda >> redis

        async_lambda = Lambda("Async Lambda Processor")
        py_lambda >> sqs
        sqs >> async_lambda
        async_lambda >> mongo

    aws_ses = SimpleEmailServiceSes("AWS SES")
    py_lambda >> aws_ses

    py_lambda >> cloudwatch

    cloudwatch >> Edge(style="dashed") >> py_lambda
    cloudwatch >> Edge(style="dashed") >> recruiter_server
    cloudwatch >> Edge(style="dashed") >> seeker_server
    cloudwatch >> Edge(style="dashed") >> dashboard_server
    cloudwatch >> Edge(style="dashed") >> accounts_server

    aws_ecr = ECR("AWS ECR")
    py_lambda >> aws_ecr

    avatars_bucket = S3("Avatars Bucket")
    py_lambda >> avatars_bucket
