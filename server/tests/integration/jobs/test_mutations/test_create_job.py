# from datetime import UTC, datetime
# from typing import Any

# import pytest
# from strawberry import relay

# from tests.integration.graphql_client import GraphQLClient

# CREATE_JOB_MUTATION = """
# mutation CreateJobMutation(
#     $organizationId: GlobalID!
#     $title: String!
#     $description: String!
#     $skills: [String!]!
#     $location: String
#     $applicantLocations: [String!]!
#     $externalApplicationUrl: String
#     $vacancies: Int
#     $minSalary: Int
#     $maxSalary: Int
#     $isSalaryNegotiable: Boolean = false
#     $minExperience: Int
#     $maxExperience: Int
#     $expiresAt: DateTime
#     $jobType: JobTypeEnum
#     $workMode: WorkModeEnum
#     $currency: String = "INR"
# ) {
#     createJob(
#         organizationId: $organizationId
#         title: $title
#         description: $description
#         skills: $skills
#         location: $location
#         applicantLocations: $applicantLocations
#         externalApplicationUrl: $externalApplicationUrl
#         vacancies: $vacancies
#         minSalary: $minSalary
#         maxSalary: $maxSalary
#         isSalaryNegotiable: $isSalaryNegotiable
#         minExperience: $minExperience
#         maxExperience: $maxExperience
#         expiresAt: $expiresAt
#         jobType: $jobType
#         workMode: $workMode
#         currency: $currency
#     ) {
#         __typename
#         ... on CreateJobSuccess {
#             jobEdge {
#                 node {
#                     id
#                     title
#                     description
#                     skills
#                     location
#                     applicantLocations
#                     externalApplicationUrl
#                     vacancies
#                     minSalary
#                     maxSalary
#                     isSalaryNegotiable
#                     minExperience
#                     maxExperience
#                     expiresAt
#                     jobType
#                     workMode
#                     currency
#                 }
#             }
#         }
#         ... on OrganizationNotFoundError {
#             __typename
#         }
#         ... on OrganizationAuthorizationError {
#             __typename
#         }
#         ... on InvalidLocationError {
#             __typename
#         }
#         ... on InvalidApplicantLocationsError {
#             __typename
#         }
#     }
# }
# """


# async def test_create_job_successful_minimal_fields(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test successful job creation with minimal required fields."""
#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Software Engineer",
#             "description": "A great software engineering position",
#             "skills": ["Python", "FastAPI"],
#             "location": None,
#             "applicantLocations": ["Mumbai", "Delhi"],
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "CreateJobSuccess"

#     job = data["jobEdge"]["node"]
#     assert job["title"] == "Software Engineer"
#     assert job["description"] == "A great software engineering position"
#     assert job["skills"] == ["Python", "FastAPI"]
#     assert job["location"] is None
#     assert job["applicantLocations"] == ["Mumbai", "Delhi"]
#     assert job["currency"] == "INR"  # default value
#     assert job["isSalaryNegotiable"] is False  # default value


# async def test_create_job_successful_all_fields(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test successful job creation with all optional fields provided."""
#     expires_at = datetime.now(UTC).replace(microsecond=0)

#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Senior Python Developer",
#             "description": "We are looking for an experienced Python developer",
#             "skills": ["Python", "Django", "PostgreSQL"],
#             "location": "Bangalore",
#             "applicantLocations": ["Bangalore", "Hyderabad", "Chennai"],
#             "externalApplicationUrl": "https://company.com/apply",
#             "vacancies": 3,
#             "minSalary": 800000,
#             "maxSalary": 1200000,
#             "isSalaryNegotiable": True,
#             "minExperience": 3,
#             "maxExperience": 7,
#             "expiresAt": expires_at.isoformat(),
#             "jobType": "FULL_TIME",
#             "workMode": "REMOTE",
#             "currency": "USD",
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "CreateJobSuccess"

#     job = data["jobEdge"]["node"]
#     assert job["title"] == "Senior Python Developer"
#     assert job["description"] == "We are looking for an experienced Python developer"
#     assert job["skills"] == ["Python", "Django", "PostgreSQL"]
#     assert job["location"] == "Bangalore"
#     assert job["applicantLocations"] == ["Bangalore", "Hyderabad", "Chennai"]
#     assert job["externalApplicationUrl"] == "https://company.com/apply"
#     assert job["vacancies"] == 3
#     assert job["minSalary"] == 800000
#     assert job["maxSalary"] == 1200000
#     assert job["isSalaryNegotiable"] is True
#     assert job["minExperience"] == 3
#     assert job["maxExperience"] == 7
#     assert job["expiresAt"] == expires_at.isoformat()
#     assert job["jobType"] == "FULL_TIME"
#     assert job["workMode"] == "REMOTE"
#     assert job["currency"] == "USD"


# async def test_create_job_organization_not_found(
#     password_auth_graphql_client: GraphQLClient,
# ) -> None:
#     """Test job creation with non-existent organization ID."""
#     invalid_org_id = relay.to_base64("Organization", "507f1f77bcf86cd799439011")

#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": invalid_org_id,
#             "title": "Software Engineer",
#             "description": "A great software engineering position",
#             "skills": ["Python"],
#             "applicantLocations": ["Mumbai"],
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "OrganizationNotFoundError"


# async def test_create_job_organization_authorization_error(
#     password_auth_graphql_client: GraphQLClient,
#     unauthorized_organization_id: str,
# ) -> None:
#     """Test job creation with organization user doesn't have access to."""
#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": unauthorized_organization_id,
#             "title": "Software Engineer",
#             "description": "A great software engineering position",
#             "skills": ["Python"],
#             "applicantLocations": ["Mumbai"],
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "OrganizationAuthorizationError"


# async def test_create_job_invalid_location(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test job creation with invalid location."""
#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Software Engineer",
#             "description": "A great software engineering position",
#             "skills": ["Python"],
#             "location": "InvalidCityName123",
#             "applicantLocations": ["Mumbai"],
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "InvalidLocationError"


# async def test_create_job_invalid_applicant_locations(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test job creation with invalid applicant locations."""
#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Software Engineer",
#             "description": "A great software engineering position",
#             "skills": ["Python"],
#             "applicantLocations": ["InvalidCity123", "AnotherInvalidCity456"],
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "InvalidApplicantLocationsError"


# async def test_create_job_unauthenticated(
#     graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test that unauthenticated requests are rejected."""
#     response = await graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Software Engineer",
#             "description": "A great software engineering position",
#             "skills": ["Python"],
#             "applicantLocations": ["Mumbai"],
#         },
#     )

#     # Should return an authentication error
#     assert "errors" in response
#     assert any(
#         "permission" in str(error).lower() or "auth" in str(error).lower()
#         for error in response["errors"]
#     )


# @pytest.mark.parametrize(
#     ("job_type", "work_mode"),
#     [
#         ("FULL_TIME", "REMOTE"),
#         ("PART_TIME", "HYBRID"),
#         ("CONTRACT", "ON_SITE"),
#         ("INTERNSHIP", "REMOTE"),
#         (None, None),
#         ("FULL_TIME", None),
#         (None, "REMOTE"),
#     ],
# )
# async def test_create_job_enum_variations(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
#     job_type: str | None,
#     work_mode: str | None,
# ) -> None:
#     """Test job creation with different enum value combinations."""
#     variables: dict[str, Any] = {
#         "organizationId": valid_organization_id,
#         "title": "Test Job",
#         "description": "Test job description",
#         "skills": ["Python"],
#         "applicantLocations": ["Mumbai"],
#     }

#     if job_type is not None:
#         variables["jobType"] = job_type
#     if work_mode is not None:
#         variables["workMode"] = work_mode

#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables=variables,
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "CreateJobSuccess"

#     job = data["jobEdge"]["node"]
#     assert job["jobType"] == job_type
#     assert job["workMode"] == work_mode


# @pytest.mark.parametrize(
#     ("title", "description", "skills", "expected_error"),
#     [
#         ("", "Valid description", ["Python"], None),  # Empty title might be valid
#         ("Valid title", "", ["Python"], None),  # Empty description might be valid
#         ("Valid title", "Valid description", [], None),  # Empty skills might be valid
#         ("Valid title", "Valid description", [""], None),  # Empty skill might be valid
#     ],
# )
# async def test_create_job_edge_case_strings(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
#     title: str,
#     description: str,
#     skills: list[str],
#     expected_error: str | None,
# ) -> None:
#     """Test job creation with edge case string values."""
#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": title,
#             "description": description,
#             "skills": skills,
#             "applicantLocations": ["Mumbai"],
#         },
#     )

#     if expected_error:
#         assert "errors" in response
#     else:
#         data = response["data"]["createJob"]
#         # Either succeeds or fails gracefully with a known error type
#         assert data["__typename"] in [
#             "CreateJobSuccess",
#             "OrganizationNotFoundError",
#             "OrganizationAuthorizationError",
#             "InvalidLocationError",
#             "InvalidApplicantLocationsError",
#         ]


# @pytest.mark.parametrize(
#     ("min_salary", "max_salary", "min_exp", "max_exp", "vacancies"),
#     [
#         (0, 1000000, 0, 10, 1),  # Minimum valid values
#         (None, None, None, None, None),  # All None
#         (500000, 500000, 5, 5, 1),  # Equal min/max values
#         (-1, 1000000, -1, 10, 0),  # Negative/zero edge cases
#         (1000000, 500000, 10, 5, 100),  # Max less than min (might be invalid)
#     ],
# )
# async def test_create_job_numeric_edge_cases(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
#     min_salary: int | None,
#     max_salary: int | None,
#     min_exp: int | None,
#     max_exp: int | None,
#     vacancies: int | None,
# ) -> None:
#     """Test job creation with edge case numeric values."""
#     variables: dict[str, Any] = {
#         "organizationId": valid_organization_id,
#         "title": "Test Job",
#         "description": "Test description",
#         "skills": ["Python"],
#         "applicantLocations": ["Mumbai"],
#     }

#     if min_salary is not None:
#         variables["minSalary"] = min_salary
#     if max_salary is not None:
#         variables["maxSalary"] = max_salary
#     if min_exp is not None:
#         variables["minExperience"] = min_exp
#     if max_exp is not None:
#         variables["maxExperience"] = max_exp
#     if vacancies is not None:
#         variables["vacancies"] = vacancies

#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables=variables,
#     )

#     # Should either succeed or fail gracefully
#     data = response["data"]["createJob"]
#     assert data["__typename"] in [
#         "CreateJobSuccess",
#         "OrganizationNotFoundError",
#         "OrganizationAuthorizationError",
#         "InvalidLocationError",
#         "InvalidApplicantLocationsError",
#     ]


# async def test_create_job_external_application_url_variations(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test job creation with different external application URL formats."""
#     test_urls = [
#         "https://company.com/apply",
#         "http://example.org/jobs/123",
#         "https://careers.startup.io/position?id=456",
#         None,
#     ]

#     for url in test_urls:
#         variables: dict[str, Any] = {
#             "organizationId": valid_organization_id,
#             "title": f"Test Job {url or 'no-url'}",
#             "description": "Test description",
#             "skills": ["Python"],
#             "applicantLocations": ["Mumbai"],
#         }

#         if url is not None:
#             variables["externalApplicationUrl"] = url

#         response = await password_auth_graphql_client(
#             CREATE_JOB_MUTATION,
#             variables=variables,
#         )

#         data = response["data"]["createJob"]
#         assert data["__typename"] == "CreateJobSuccess"

#         job = data["jobEdge"]["node"]
#         assert job["externalApplicationUrl"] == url


# async def test_create_job_multiple_skills_and_locations(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test job creation with multiple skills and applicant locations."""
#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Full Stack Developer",
#             "description": "Looking for a versatile developer",
#             "skills": [
#                 "Python",
#                 "JavaScript",
#                 "React",
#                 "Django",
#                 "PostgreSQL",
#                 "Docker",
#                 "AWS",
#                 "Git",
#             ],
#             "applicantLocations": [
#                 "Mumbai",
#                 "Delhi",
#                 "Bangalore",
#                 "Hyderabad",
#                 "Chennai",
#                 "Pune",
#                 "Kolkata",
#                 "Ahmedabad",
#             ],
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "CreateJobSuccess"

#     job = data["jobEdge"]["node"]
#     assert len(job["skills"]) == 8
#     assert len(job["applicantLocations"]) == 8
#     assert "Python" in job["skills"]
#     assert "Mumbai" in job["applicantLocations"]


# async def test_create_job_future_expiry_date(
#     password_auth_graphql_client: GraphQLClient,
#     valid_organization_id: str,
# ) -> None:
#     """Test job creation with future expiry date."""
#     future_date = datetime(2025, 12, 31, 23, 59, 59, tzinfo=UTC)

#     response = await password_auth_graphql_client(
#         CREATE_JOB_MUTATION,
#         variables={
#             "organizationId": valid_organization_id,
#             "title": "Future Job",
#             "description": "Job with future expiry",
#             "skills": ["Python"],
#             "applicantLocations": ["Mumbai"],
#             "expiresAt": future_date.isoformat(),
#         },
#     )

#     data = response["data"]["createJob"]
#     assert data["__typename"] == "CreateJobSuccess"

#     job = data["jobEdge"]["node"]
#     assert job["expiresAt"] == future_date.isoformat()
