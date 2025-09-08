'use client';
import type { SearchHeaderFragment$key } from '@/__generated__/SearchHeaderFragment.graphql';
import IncompleteProfileBanner from '@/components/layout/IncompleteProfileBanner';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { ExternalLinkIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import JobSearchAutocomplete from '../forms/JobSearchAutocomplete';
import GoogleOneTapLogin from '../GoogleOneTapLogin';
import AuthNavigation from '../layout/AuthNavigation';
import Logo from '../Logo';
import type { FilterValues } from './FilterSidebar';

export const SearchHeaderFragment = graphql`
  fragment SearchHeaderFragment on Query {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
		...IncompleteProfileBannerFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
  }
`;

export default function SearchHeader({
	query,
	searchTerm,
	location,
	setFilters,
	filters
}: {
	query: SearchHeaderFragment$key;
	searchTerm: string | null;
	location: string | null;
	setFilters: (filters: FilterValues | ((prevFilters: FilterValues) => FilterValues)) => void;
	filters: FilterValues;
}) {
	const data = useFragment(SearchHeaderFragment, query);
	const router = useRouter();
	const searchParams = useSearchParams();

	// Local state for input value, initialized from nuqs filter
	const [inputValue, setInputValue] = useState(searchTerm || '');

	// Sync local state when nuqs filter changes externally
	useEffect(() => {
		setInputValue(searchTerm || '');
	}, [searchTerm]);

	const handleJobSearchSubmit = (speciality: string) => {
		if (!speciality.trim()) return;

		// Build redirect URL based on location presence
		let redirectUrl: string;
		if (location) {
			redirectUrl = links.search(location, speciality);
		} else {
			redirectUrl = links.search(undefined, speciality);
		}

		// Preserve existing query parameters
		const params = new URLSearchParams(searchParams.toString());
		if (params.toString()) {
			redirectUrl += `?${params.toString()}`;
		}

		router.push(redirectUrl);
	};

	return (
		<div className={'w-full flex flex-col sticky top-0 z-50'}>
			{data.viewer.__typename === 'Account' && <IncompleteProfileBanner account={data.viewer} animate={false} />}
			<Navbar
				maxWidth='xl'
				isBordered
				position='static'
				classNames={{
					base: 'bg-background-600',
					brand: 'basis-auto flex-shrink-0',
					content:
						'data-[justify-center]:flex-1 data-[justify-center]:w-full data-[justify-center]:flex data-[justify-center]:justify-center data-[justify-end]:basis-auto data-[justify-end]:flex-shrink-0'
				}}
				isBlurred={false}
			>
				<NavbarContent justify='center' className='flex-1 w-full flex gap-12'>
					<NavbarBrand className={'flex items-center gap-4 text-foreground-500'}>
						<Link href={links.landing} className='font-medium text-inherit flex items-center gap-4'>
							<Logo /> <span className='font-medium text-inherit sm:flex items-center gap-4 hidden'>{APP_NAME}</span>
						</Link>
					</NavbarBrand>
					<NavbarItem className='w-full'>
						<JobSearchAutocomplete
							value={inputValue}
							onValueChange={setInputValue}
							onSubmit={handleJobSearchSubmit}
							onClear={() => {
								setInputValue('');
								// Redirect to base search page
								router.push(location ? links.search(location) : links.search());
							}}
							placeholder='Search by Speciality or keyword'
							startContent={<SearchIcon size={16} className='text-foreground-500' />}
							onJobSelect={job => {
								setInputValue(job.displayName);
								handleJobSearchSubmit(job.displayName);
							}}
							fullWidth
							variant='bordered'
							className='hidden lg:block'
							inputProps={{
								classNames: {
									inputWrapper: 'bg-background'
								}
							}}
						/>
					</NavbarItem>
					{data.viewer.__typename === 'Account' ? (
						<div className='flex items-center gap-2'>
							<NavbarItem className='hidden md:block'>
								<Link
									href={env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}
									target='_blank'
									rel='noopener noreferrer'
									color='foreground'
									className={'text-foreground flex items-center gap-2'}
								>
									For Recruiters <ExternalLinkIcon className='w-4 h-4' />
								</Link>
							</NavbarItem>
							<AuthNavigation rootQuery={data.viewer} />
						</div>
					) : (
						<div className='flex items-center gap-2 sm:gap-4'>
							<GoogleOneTapLogin />
							<NavbarItem>
								<Button as={Link} color='default' href={links.login(env.NEXT_PUBLIC_URL)}>
									Log In
								</Button>
							</NavbarItem>
							<NavbarItem>
								<Button
									as={Link}
									href={links.recruiterLanding}
									target='_blank'
									rel='noopener noreferrer'
									color='default'
									className='text-base'
									variant='flat'
								>
									For Recruiters
								</Button>
							</NavbarItem>
						</div>
					)}
				</NavbarContent>
			</Navbar>
		</div>
	);
}
