import type { OrganizationDetailsFragment$key } from '@/__generated__/OrganizationDetailsFragment.graphql';
import type { OrganizationDetailsInternalFragment$key as OrganizationDetailsInternalFragmentType } from '@/__generated__/OrganizationDetailsInternalFragment.graphql';
import { Card, CardBody, CardHeader, Divider, Link, Tooltip } from '@heroui/react';
import { Mail, MapPin, VerifiedIcon } from 'lucide-react';
import Image from 'next/image';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';

const OrganizationDetailsFragment = graphql`
  fragment OrganizationDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    organization(slug: $slug) {
      __typename
      ... on Organization {
        ...OrganizationDetailsInternalFragment
      }

    }
  }
`;
const OrganizationDetailsInternalFragment = graphql`
  fragment OrganizationDetailsInternalFragment on Organization {
    name
    logoUrl
    descriptionHtml
    website
    email
    location
	verificationStatus {
		__typename
		... on Verified @alias(as: "verified") {
			verifiedAt
		}
		... on Rejected {
			rejectedAt
		}
		... on Pending {
			requestedAt
		}
		... on NotRequested {
			message
		}
	}
  }
`;

export default function OrganizationDetails({ rootQuery }: { rootQuery: OrganizationDetailsFragment$key }) {
	const root = useFragment(OrganizationDetailsFragment, rootQuery);
	invariant(root.organization.__typename === 'Organization', "Expected 'Organization' node type");
	const data = useFragment<OrganizationDetailsInternalFragmentType>(OrganizationDetailsInternalFragment, root.organization);

	return (
		<div className='w-full flex flex-col gap-6'>
			<Card fullWidth className='p-6 space-y-6' shadow='none'>
				<CardHeader>
					<div className='flex w-full justify-between gap-12 sm:gap-6 sm:items-center flex-col sm:flex-row items-start'>
						<div className='w-full flex flex-col gap-6'>
							<div className='flex flex-col sm:flex-row gap-6 items-start w-full'>
								<div className='relative aspect-square w-16 h-16'>
									<Image
										src={data.logoUrl}
										alt={data.name}
										fill
										className='rounded-md object-cover'
										sizes='(max-width: 640px) 48px, 56px'
									/>
								</div>
								<div className='flex flex-col gap-4 items-start w-full'>
									<div className='flex flex-row items-center gap-2'>
										<h4 className='text-lg sm:text-xl font-medium'>{data.name}</h4>
										{data.verificationStatus.verified && (
											<Tooltip content='This organization is verified' placement='right'>
												<VerifiedIcon className='w-4 h-4 text-primary' strokeWidth={2.5} />
											</Tooltip>
										)}
									</div>
									{(data.location || data.email || data.website) && (
										<div className='flex flex-wrap gap-4 items-center text-foreground-600 w-full'>
											{data.location && (
												<div className='flex items-center gap-2'>
													<MapPin size={16} />
													{data.location}
												</div>
											)}
											{data.email && (
												<div className='flex items-center gap-2'>
													<Mail size={16} /> {data.email}
												</div>
											)}
											{data.website && (
												<Link showAnchorIcon className='text-foreground-600' href={data.website} isExternal>
													Visit website
												</Link>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
						{/* TODO: add this after notifications infra
						<Button size="lg" className="w-full sm:w-auto">
							Follow
						</Button>*/}
					</div>
				</CardHeader>
			</Card>
			{data.descriptionHtml && (
				<Card fullWidth className='p-6' shadow='none'>
					<CardBody className='flex flex-col gap-6 w-full'>
						<h2 className='text-medium font-medium text-foreground-600'>About the Organization</h2>
						<Divider />
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
							className='prose prose-foreground prose-sm max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:mt-0 prose-p:mb-3 prose-ul:mt-1 prose-ul:mb-2 prose-li:mt-1 prose-li:mb-2 prose-strong:font-semibold prose-blockquote:mt-1 prose-blockquote:mb-2 prose-code:mt-1 prose-code:mb-2 prose-pre:mt-1 prose-pre:mb-2 prose-table:mt-1 prose-table:mb-2 prose-thead:mt-1 prose-thead:mb-2 prose-tbody:mt-1 prose-tbody:mb-2 prose-tfoot:mt-1 prose-tfoot:mb-2 prose-tr:mt-1 prose-tr:mb-2 prose-th:mt-1 prose-th:mb-2 prose-td:mt-1 prose-td:mb-2'
						/>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
