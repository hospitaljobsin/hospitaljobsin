from diagrams import Cluster, Diagram
from diagrams.aws.compute import ECR, Lambda
from diagrams.aws.engagement import SimpleEmailServiceSes
from diagrams.aws.general import User
from diagrams.aws.integration import SQS
from diagrams.aws.management import Cloudwatch
from diagrams.aws.network import APIGateway, CloudFront, Route53
from diagrams.aws.storage import S3
from diagrams.onprem.database import Mongodb
from diagrams.onprem.inmemory import Redis

with Diagram("HospitalJobs.in System Architecture", show=False, direction="TB"):
    user = User("End User")
    route53 = Route53("AWS Route53 DNS")
    user >> route53

    with Cluster("CloudFront Distributions", direction="LR"):
        with Cluster("hospitaljobs.in\n(Seeker Portal)", direction="TB"):
            cf_seeker = CloudFront("AWS CloudFront")
            seeker_server = Lambda("Seeker Server")
            image_opt = Lambda("Image Opt")
            static_assets = S3("Static Assets")
            cf_seeker >> seeker_server
            cf_seeker >> image_opt
            cf_seeker >> static_assets

        with Cluster("recruiter.hospitaljobs.in\n(Recruiter Portal)", direction="TB"):
            cf_recruiter = CloudFront("AWS CloudFront")
            recruiter_server = Lambda("Recruiter Server")
            image_opt = Lambda("Image Opt")
            static_assets = S3("Static Assets")
            cf_recruiter >> recruiter_server

        with Cluster("*.hospitaljobs.in\n(Recruiter Dashboard)", direction="TB"):
            cf_dashboard = CloudFront("AWS CloudFront")
            dashboard_server = Lambda("Recruiter Dashboard Server")
            image_opt = Lambda("Image Opt")
            static_assets = S3("Static Assets")
            cf_dashboard >> dashboard_server

        with Cluster("accounts.hospitaljobs.in\n(Accounts UI)", direction="TB"):
            cf_accounts = CloudFront("AWS CloudFront")
            accounts_server = Lambda("Accounts UI Server")
            image_opt = Lambda("Image Opt")
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

    # SQS and async Lambda
    sqs = SQS("SQS Queue")
    # API Gateway routes to Python Lambda (FastAPI GraphQL)
    with Cluster("Backend API Layer", direction="TB"):
        py_lambda = Lambda("Python Lambda\nFastAPI GraphQL")
        api_gateway >> py_lambda

        # Primary DB and cache
        mongo = Mongodb("MongoDB (Primary DB)")
        redis = Redis("Redis (Cache)")
        py_lambda >> mongo
        py_lambda >> redis

        async_lambda = Lambda("Async Lambda Processor")
        py_lambda >> sqs
        sqs >> async_lambda
        async_lambda >> mongo

    aws_ses = SimpleEmailServiceSes("AWS SES")
    py_lambda >> aws_ses

    cloudwatch = Cloudwatch("AWS Cloudwatch")
    py_lambda >> cloudwatch

    cloudwatch >> py_lambda
    cloudwatch >> recruiter_server
    cloudwatch >> seeker_server
    cloudwatch >> dashboard_server
    cloudwatch >> accounts_server

    aws_ecr = ECR("AWS ECR")
    py_lambda >> aws_ecr
