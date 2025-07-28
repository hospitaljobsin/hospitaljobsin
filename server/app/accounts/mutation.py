from datetime import date
from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry.permission import PermissionExtension

from app.accounts.exceptions import (
    InvalidPhoneNumberError,
    InvalidPhoneNumberVerificationTokenError,
    PhoneNumberAlreadyExistsError,
    PhoneNumberDoesNotExistError,
    PhoneNumberVerificationTokenCooldownError,
)
from app.accounts.services import AccountService, ProfileParserService, ProfileService
from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo

from .types import (
    AccountType,
    CertificationInputType,
    CreatePhoneNumberVerificationTokenSuccessType,
    CreateProfilePicturePresignedURLPayloadType,
    EducationInputType,
    GenderTypeEnum,
    GenerateProfileDocumentPresignedURLPayloadType,
    InvalidPhoneNumberErrorType,
    InvalidPhoneNumberVerificationTokenErrorType,
    LanguageInputType,
    LicenseInputType,
    MaritalStatusTypeEnum,
    ParseProfileDocumentPayload,
    PhoneNumberAlreadyExistsErrorType,
    PhoneNumberDoesNotExistErrorType,
    PhoneNumberVerificationTokenCooldownErrorType,
    ProfileType,
    RemoveAccountPhoneNumberPayload,
    RequestPhoneNumberVerificationTokenPayload,
    UpdateAccountPayload,
    UpdateAccountPhoneNumberPayload,
    UpdateProfilePayload,
    WorkExperienceInputType,
)


@strawberry.type
class AccountMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile personal details.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_personal_details(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        gender: Annotated[
            GenderTypeEnum | None,
            strawberry.argument(
                description="The gender of the user profile.",
            ),
        ] = strawberry.UNSET,
        date_of_birth: Annotated[
            date | None,
            strawberry.argument(
                description="The date of birth of the user profile.",
            ),
        ] = strawberry.UNSET,
        marital_status: Annotated[
            MaritalStatusTypeEnum | None,
            strawberry.argument(
                description="The marital status of the user profile.",
            ),
        ] = strawberry.UNSET,
        category: Annotated[
            str | None,
            strawberry.argument(
                description="The category of the user profile.",
            ),
        ] = strawberry.UNSET,
    ) -> UpdateProfilePayload:
        """Update the current user's profile personal details."""
        match await profile_service.update_personal_details(
            account=info.context["current_user"],
            gender=gender.value if gender is not None else None,
            date_of_birth=date_of_birth,
            marital_status=marital_status.value if marital_status is not None else None,
            category=category,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile languages.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_languages(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        languages: Annotated[
            list[LanguageInputType],
            strawberry.argument(
                description="The languages of the user profile.",
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile languages."""
        match await profile_service.update_languages(
            account=info.context["current_user"],
            languages=[language.to_document() for language in languages],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateProfilePicturePresignedURLPayloadType,
        description="Create a profile picture presigned URL.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_profile_picture_presigned_url(
        self,
        account_service: Annotated[AccountService, Inject],
        content_type: Annotated[
            str, strawberry.argument(description="The content type of the file.")
        ],
    ) -> CreateProfilePicturePresignedURLPayloadType:
        """Create a profile picture presigned url."""
        result = await account_service.create_profile_picture_presigned_url(
            content_type=content_type
        )
        return CreateProfilePicturePresignedURLPayloadType(presigned_url=result)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateAccountPayload,
        description="Update the current user's account.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_account(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
        full_name: Annotated[
            str,
            strawberry.argument(
                description="The full name of the user account.",
            ),
        ] = strawberry.UNSET,
        avatar_url: Annotated[
            str | None,
            strawberry.argument(
                description="The URL of the profile picture.",
            ),
        ] = strawberry.UNSET,
    ) -> UpdateAccountPayload:
        """Update the current user's account."""
        match await account_service.update(
            account=info.context["current_user"],
            full_name=full_name,
            avatar_url=avatar_url,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestPhoneNumberVerificationTokenPayload,
        description="Create a phone number verification token.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def request_phone_number_verification_token(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
        phone_number: Annotated[
            str,
            strawberry.argument(
                description="The phone of the user account.",
            ),
        ],
    ) -> RequestPhoneNumberVerificationTokenPayload:
        """Create a phone number verification token."""
        match await account_service.request_phone_number_verification_token(
            account=info.context["current_user"],
            phone_number=phone_number,
        ):
            case Ok(_):
                return CreatePhoneNumberVerificationTokenSuccessType()
            case Err(error):
                match error:
                    case InvalidPhoneNumberError():
                        return InvalidPhoneNumberErrorType()
                    case PhoneNumberAlreadyExistsError():
                        return PhoneNumberAlreadyExistsErrorType()
                    case PhoneNumberVerificationTokenCooldownError() as err:
                        return PhoneNumberVerificationTokenCooldownErrorType(
                            remaining_seconds=err.remaining_seconds,
                        )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateAccountPhoneNumberPayload,
        description="Update the current user's phone number.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_account_phone_number(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
        phone_number: Annotated[
            str,
            strawberry.argument(
                description="The phone of the user account.",
            ),
        ],
        phone_number_verification_token: Annotated[
            str,
            strawberry.argument(
                description="The phone number verification token.",
            ),
        ],
    ) -> UpdateAccountPhoneNumberPayload:
        """Update the current user's phone number."""
        match await account_service.update_phone_number(
            account=info.context["current_user"],
            phone_number=phone_number,
            phone_number_verification_token=phone_number_verification_token,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case Err(error):
                match error:
                    case InvalidPhoneNumberVerificationTokenError():
                        return InvalidPhoneNumberVerificationTokenErrorType()
                    case InvalidPhoneNumberError():
                        return InvalidPhoneNumberErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RemoveAccountPhoneNumberPayload,
        description="Remove the current user's phone number.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def remove_account_phone_number(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
    ) -> RemoveAccountPhoneNumberPayload:
        """Remove the current user's phone number."""
        match await account_service.remove_phone_number(
            account=info.context["current_user"],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case Err(error):
                match error:
                    case PhoneNumberDoesNotExistError():
                        return PhoneNumberDoesNotExistErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile location preferences.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_location_preferences(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        locations_open_to_work: Annotated[
            list[str],
            strawberry.argument(description="Locations the user is open to work in."),
        ],
        open_to_relocation_anywhere: Annotated[
            bool,
            strawberry.argument(
                description="Whether the user is open to relocation anywhere."
            ),
        ],
        address: Annotated[
            str | None,
            strawberry.argument(
                description="The address of the user profile (now part of location preferences).",
            ),
        ] = strawberry.UNSET,
    ) -> UpdateProfilePayload:
        """Update the current user's profile location preferences, including address."""
        match await profile_service.update_location_preferences(
            account=info.context["current_user"],
            locations_open_to_work=locations_open_to_work,
            open_to_relocation_anywhere=open_to_relocation_anywhere,
            address=address,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile education.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_education(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        education: Annotated[
            list[EducationInputType],
            strawberry.argument(
                description="The education history of the user profile.",
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile education."""
        match await profile_service.update_education(
            account=info.context["current_user"],
            education=[edu.to_document() for edu in education],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile work experience.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_experience(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        work_experience: Annotated[
            list[WorkExperienceInputType],
            strawberry.argument(
                description="The work experience history of the user profile.",
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile work experience."""
        match await profile_service.update_experience(
            account=info.context["current_user"],
            work_experience=[exp.to_document() for exp in work_experience],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile certifications.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_certifications(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        certifications: Annotated[
            list[CertificationInputType],
            strawberry.argument(
                description="The certifications of the user profile.",
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile certifications."""
        match await profile_service.update_certifications(
            account=info.context["current_user"],
            certifications=[cert.to_document() for cert in certifications],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile licenses.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_licenses(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        licenses: Annotated[
            list[LicenseInputType],
            strawberry.argument(
                description="The licenses of the user profile.",
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile licenses."""
        match await profile_service.update_licenses(
            account=info.context["current_user"],
            licenses=[lic.to_document() for lic in licenses],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile about me.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_about_me(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        professional_summary: Annotated[
            str | None,
            strawberry.argument(
                description="The professional summary of the user profile.",
            ),
        ] = strawberry.UNSET,
        headline: Annotated[
            str | None,
            strawberry.argument(
                description="The headline of the user profile.",
            ),
        ] = strawberry.UNSET,
    ) -> UpdateProfilePayload:
        """Update the current user's profile about me."""
        match await profile_service.update_about_me(
            account=info.context["current_user"],
            professional_summary=professional_summary,
            headline=headline,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=ParseProfileDocumentPayload,
        description="Parse a profile document into structured data.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def parse_profile_document(
        self,
        info: AuthInfo,
        profile_parser_service: Annotated[ProfileParserService, Inject],
        file_key: Annotated[
            str,
            strawberry.argument(
                description="The document URL to parse.",
            ),
        ],
        overwrite: Annotated[
            bool,
            strawberry.argument(
                description="Whether to overwrite the existing profile.",
            ),
        ] = False,
    ) -> ParseProfileDocumentPayload:
        """Parse a profile document into structured data."""
        match await profile_parser_service.parse_profile_document(
            file_key=file_key,
            account=info.context["current_user"],
            overwrite=overwrite,
        ):
            case Ok(profile):
                return ProfileType.marshal(profile)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GenerateProfileDocumentPresignedURLPayloadType,
        description="Parse a profile document into structured data.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def generate_profile_document_presigned_url(
        self,
        info: AuthInfo,
        profile_parser_service: Annotated[ProfileParserService, Inject],
        content_type: Annotated[
            str,
            strawberry.argument(
                description="The content type of the file.",
            ),
        ],
    ) -> GenerateProfileDocumentPresignedURLPayloadType:
        """Generate a profile document presigned URL."""
        match await profile_parser_service.generate_presigned_url(content_type):
            case Ok(result):
                presigned_url, file_key = result
                return GenerateProfileDocumentPresignedURLPayloadType(
                    presigned_url=presigned_url, file_key=file_key
                )
            case _ as unreachable:
                assert_never(unreachable)
