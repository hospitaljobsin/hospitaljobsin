'use client';

import { Button, Input, Navbar, NavbarContent, NavbarItem } from '@heroui/react';
import { ExternalLinkIcon, Filter, MapPinIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { MapHeaderFragment$key } from '@/__generated__/MapHeaderFragment.graphql';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import JobSearchAutocomplete from '../forms/JobSearchAutocomplete';
import type { SearchLocation } from '../forms/LocationAutocomplete';
import LocationAutocomplete from '../forms/LocationAutocomplete';
import GoogleOneTapLogin from '../GoogleOneTapLogin';
import Logo from '../Logo';
import MobileFilterScene from '../search/map/MobileFilterScene';
import AuthNavigation from './AuthNavigation';

export const MapHeaderFragment = graphql`
  fragment MapHeaderFragment on Query {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
  }
`;

interface MapHeaderProps {
	query: MapHeaderFragment$key;
	searchTerm: string | null;
	location: string | null;
	onSearchTermChange?: (term: string | null) => void;
	onLocationChange?: (location: string | null) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	filters?: {
		minExperience: number | null;
		minSalary: number | null;
		maxSalary: number | null;
		workMode: readonly string[];
		jobType: readonly string[];
	};
	onFiltersClick?: () => void;
	onFiltersChange?: (filters: Partial<MapHeaderProps['filters']>) => void;
	resultCount?: number;
}

export default function MapHeader({
	query,
	searchTerm,
	location,
	onSearchTermChange,
	onLocationChange,
	onLocationSelect,
	filters,
	onFiltersClick,
	onFiltersChange,
	resultCount = 0
}: MapHeaderProps) {
	const data = useFragment(MapHeaderFragment, query);
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
	const [localLocation, setLocalLocation] = useState(location || '');
	const [showMobileScene, setShowMobileScene] = useState(false);

	const handleSearchSubmit = useCallback(() => {
		onSearchTermChange?.(localSearchTerm.trim() || null);
	}, [localSearchTerm, onSearchTermChange]);

	const handleLocationSubmit = useCallback(() => {
		onLocationChange?.(localLocation.trim() || null);
	}, [localLocation, onLocationChange]);

	const handleSearchClear = useCallback(() => {
		setLocalSearchTerm('');
		onSearchTermChange?.(null);
	}, [onSearchTermChange]);

	const handleLocationClear = useCallback(() => {
		setLocalLocation('');
		onLocationChange?.(null);
	}, [onLocationChange]);

	// Count active filters for badge
	const activeFilterCount = useMemo(() => {
		if (!filters) return 0;
		return (
			(filters.minExperience ? 1 : 0) + (filters.minSalary || filters.maxSalary ? 1 : 0) + filters.workMode.length + filters.jobType.length
		);
	}, [filters]);

	return (
		<Navbar
			maxWidth='full'
			isBordered
			position='static'
			classNames={{
				base: 'bg-background/95 backdrop-blur-md',
				wrapper: 'px-4 sm:px-6',
				brand: 'basis-auto flex-shrink-0',
				content: 'gap-2 sm:gap-4'
			}}
			isBlurred={false}
		>
			{/* Mobile: Logo + Dummy Search Input */}
			<NavbarContent justify='start' className='md:hidden flex-1 gap-2'>
				<NavbarItem className='flex-shrink-0'>
					<Link href={links.landing} className='font-medium text-inherit flex items-center gap-2'>
						<Logo />
					</Link>
				</NavbarItem>
				<NavbarItem className='flex-1 min-w-full'>
					<Input
						placeholder='Search jobs...'
						startContent={<SearchIcon className='text-foreground-600' size={16} />}
						variant='faded'
						size='sm'
						readOnly
						fullWidth
						onClick={() => setShowMobileScene(true)}
						className='cursor-pointer'
						classNames={{
							input: 'cursor-pointer',
							inputWrapper: 'cursor-pointer bg-background/50'
						}}
					/>
				</NavbarItem>
			</NavbarContent>

			{/* Desktop: Logo + Search Inputs */}
			<NavbarContent justify='start' className='flex-1 w-full hidden md:flex gap-2 space-x-4'>
				<NavbarItem className='shrink'>
					<Link href={links.landing} className='font-medium text-inherit flex items-center gap-2 sm:gap-4'>
						<Logo />
						<span className='font-medium text-foreground-600 hidden sm:inline'>{APP_NAME}</span>
					</Link>
				</NavbarItem>
				<NavbarItem className='flex-1'>
					<JobSearchAutocomplete
						value={localSearchTerm}
						onValueChange={setLocalSearchTerm}
						onSubmit={handleSearchSubmit}
						onClear={handleSearchClear}
						placeholder='Speciality or Keyword'
						startContent={<SearchIcon className='text-foreground-600' size={16} />}
						variant='faded'
						size='md'
						fullWidth
						inputProps={{
							classNames: {
								inputWrapper: 'bg-background/50'
							}
						}}
					/>
				</NavbarItem>
				<NavbarItem className='flex-1'>
					<LocationAutocomplete
						value={localLocation}
						onValueChange={setLocalLocation}
						onChange={onLocationSelect}
						onSubmit={handleLocationSubmit}
						onClear={handleLocationClear}
						placeholder='Location'
						startContent={<MapPinIcon className='text-foreground-600' size={16} />}
						variant='faded'
						size='md'
						fullWidth
						inputProps={{
							classNames: {
								inputWrapper: 'bg-background/50'
							}
						}}
					/>
				</NavbarItem>

				{/* Filters Button - Desktop only */}
				<NavbarItem className='hidden md:block'>
					<Button variant='flat' onPress={onFiltersClick} isIconOnly className='px-3 min-w-fit whitespace-nowrap'>
						<Filter size={16} />
					</Button>
				</NavbarItem>
			</NavbarContent>

			{/* Right: Auth/Actions */}
			<NavbarContent justify='end' className='flex-shrink-0 min-w-0'>
				{data.viewer.__typename === 'Account' ? (
					<>
						<NavbarItem className='hidden md:block'>
							<Link
								href={env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}
								target='_blank'
								rel='noopener noreferrer'
								color='foreground'
								className='text-foreground flex items-center gap-2'
							>
								For Recruiters <ExternalLinkIcon className='w-4 h-4' />
							</Link>
						</NavbarItem>
						<AuthNavigation rootQuery={data.viewer} />
					</>
				) : (
					<>
						<GoogleOneTapLogin />
						<NavbarItem className='hidden sm:block'>
							<Button as={Link} color='primary' href={links.login(env.NEXT_PUBLIC_URL)} size='sm'>
								Log In
							</Button>
						</NavbarItem>
						<NavbarItem className='hidden sm:block'>
							<Button
								as={Link}
								href={links.recruiterLanding}
								target='_blank'
								rel='noopener noreferrer'
								color='default'
								variant='flat'
								size='sm'
							>
								For Recruiters
							</Button>
						</NavbarItem>
					</>
				)}
			</NavbarContent>

			{/* Mobile Filter Scene */}
			<MobileFilterScene
				isOpen={showMobileScene}
				onClose={() => setShowMobileScene(false)}
				searchTerm={searchTerm}
				location={location}
				onSearchTermChange={onSearchTermChange}
				onLocationChange={onLocationChange}
				onLocationSelect={onLocationSelect}
				filters={
					filters || {
						jobType: [],
						workMode: [],
						minExperience: null,
						minSalary: null,
						maxSalary: null
					}
				}
				onFiltersChange={onFiltersChange}
				quickFilters={[
					{ label: 'Full-time', value: 'full_time', active: filters?.jobType?.includes('full_time') || false },
					{ label: 'Remote', value: 'remote', active: filters?.workMode?.includes('remote') || false },
					{ label: 'Entry Level', value: 'entry', active: filters?.minExperience === 0 },
					{ label: 'Senior Level', value: 'senior', active: (filters?.minExperience || 0) >= 5 }
				]}
				onQuickFilterToggle={value => {
					if (!onFiltersChange) return;
					switch (value) {
						case 'full_time':
							onFiltersChange({
								jobType: filters?.jobType?.includes('full_time')
									? filters.jobType.filter((t: string) => t !== 'full_time')
									: [...(filters?.jobType || []), 'full_time']
							});
							break;
						case 'remote':
							onFiltersChange({
								workMode: filters?.workMode?.includes('remote')
									? filters.workMode.filter((m: string) => m !== 'remote')
									: [...(filters?.workMode || []), 'remote']
							});
							break;
						case 'entry':
							onFiltersChange({ minExperience: filters?.minExperience === 0 ? null : 0 });
							break;
						case 'senior':
							onFiltersChange({ minExperience: (filters?.minExperience || 0) >= 5 ? null : 5 });
							break;
					}
				}}
				resultCount={resultCount}
				initialFocus='search'
			/>
		</Navbar>
	);
}
