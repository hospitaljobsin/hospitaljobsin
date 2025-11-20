'use client';
import { Button, Card, CardBody, Divider, Link, Tooltip } from '@heroui/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Facebook, Gift, Instagram, Linkedin, Mail, MapPin, VerifiedIcon, Youtube } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import type { OrganizationDetailsFragment$key } from '@/__generated__/OrganizationDetailsFragment.graphql';
import type { OrganizationDetailsInternalFragment$key as OrganizationDetailsInternalFragmentType } from '@/__generated__/OrganizationDetailsInternalFragment.graphql';

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
	homePageBannerUrl
    descriptionHtml
    website
    email
    location
	socialLinks {
		linkedinUrl
		youtubeUrl
		instagramUrl
		facebookUrl
	}
	employeeBenefits(first: 100) {
		edges {
			node {
				id
				title
				description
				posterImageUrl
				order
			}
		}
	}
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

	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	return (
		<div className='w-full flex flex-col gap-6'>
			<Card fullWidth shadow='none' className='overflow-visible'>
				{/* Banner Image */}
				<div className='relative w-full' style={{ aspectRatio: '4.8' }}>
					<Image
						src={data.homePageBannerUrl}
						alt={`${data.name} banner`}
						fill
						className='object-cover rounded-t-lg'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
						priority
					/>

					{/* Logo Overlapping Banner */}
					<div className='absolute -bottom-16 sm:-bottom-12 left-6 sm:left-8'>
						<div className='relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-background bg-background'>
							<Image src={data.logoUrl} alt={data.name} fill className='object-cover' sizes='(max-width: 640px) 96px, 128px' />
						</div>
					</div>
				</div>

				{/* Organization Details */}
				<CardBody className='flex flex-col gap-4 mt-12 p-6'>
					<div className='flex flex-row items-center gap-2'>
						<h1 className='text-2xl sm:text-3xl font-semibold'>{data.name}</h1>
						{data.verificationStatus.verified && (
							<Tooltip content='This organization is verified' placement='right'>
								<VerifiedIcon className='w-5 h-5 text-primary' strokeWidth={2.5} />
							</Tooltip>
						)}
					</div>
					<div className='flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center'>
						{(data.location || data.email || data.website) && (
							<div className='flex flex-wrap gap-4 items-center text-foreground-600 text-sm'>
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
									<Link showAnchorIcon href={data.website} isExternal>
										Visit website
									</Link>
								)}
							</div>
						)}

						{/* Social Links */}
						{data.socialLinks &&
							(data.socialLinks.linkedinUrl ||
								data.socialLinks.youtubeUrl ||
								data.socialLinks.instagramUrl ||
								data.socialLinks.facebookUrl) && (
								<div className='flex gap-3 items-center'>
									{data.socialLinks.linkedinUrl && (
										<Link href={data.socialLinks.linkedinUrl} isExternal aria-label='LinkedIn'>
											<Linkedin size={20} className='text-foreground-500 hover:text-foreground transition-colors' />
										</Link>
									)}
									{data.socialLinks.youtubeUrl && (
										<Link href={data.socialLinks.youtubeUrl} isExternal aria-label='YouTube'>
											<Youtube size={20} className='text-foreground-500 hover:text-foreground transition-colors' />
										</Link>
									)}
									{data.socialLinks.instagramUrl && (
										<Link href={data.socialLinks.instagramUrl} isExternal aria-label='Instagram'>
											<Instagram size={20} className='text-foreground-500 hover:text-foreground transition-colors' />
										</Link>
									)}
									{data.socialLinks.facebookUrl && (
										<Link href={data.socialLinks.facebookUrl} isExternal aria-label='Facebook'>
											<Facebook size={20} className='text-foreground-500 hover:text-foreground transition-colors' />
										</Link>
									)}
								</div>
							)}
					</div>
				</CardBody>
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
			{/* Employee Benefits */}
			{data.employeeBenefits?.edges && data.employeeBenefits.edges.length > 0 && (
				<Card fullWidth className='p-6' shadow='none'>
					<CardBody className='flex flex-col gap-6 w-full'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Gift size={20} className='text-foreground-600' />
								<h2 className='text-medium font-medium text-foreground-600'>Employee Benefits</h2>
							</div>
							<div className='flex gap-2'>
								<Button isIconOnly size='sm' variant='flat' onPress={scrollPrev}>
									<ChevronLeft size={18} />
								</Button>
								<Button isIconOnly size='sm' variant='flat' onPress={scrollNext}>
									<ChevronRight size={18} />
								</Button>
							</div>
						</div>
						<Divider />
						<div className='overflow-hidden' ref={emblaRef}>
							<div className='flex gap-4'>
								{data.employeeBenefits.edges.map(({ node: benefit }) => (
									<div key={benefit.id} className='flex-[0_0_100%] min-w-0'>
										<Card className='h-full' shadow='none'>
											<CardBody className='flex flex-row gap-6'>
												{benefit.posterImageUrl && (
													<div className='relative w-96 h-64 flex-shrink-0 rounded-md overflow-hidden'>
														<Image src={benefit.posterImageUrl} alt={benefit.title} fill className='object-cover' sizes='256px' />
													</div>
												)}
												<div className='flex flex-col gap-4'>
													<h3 className='text-lg font-medium'>{benefit.title}</h3>
													<div
														// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
														dangerouslySetInnerHTML={{ __html: benefit.description }}
														className='prose prose-foreground prose-sm max-w-none text-foreground-600'
													/>
												</div>
											</CardBody>
										</Card>
									</div>
								))}
							</div>
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
