'use client';

import { Input, Navbar, NavbarContent, NavbarItem } from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { MapHeaderFragment$key } from '@/__generated__/MapHeaderFragment.graphql';
import links from '@/lib/links';
import type { SearchLocation } from '../forms/LocationAutocomplete';
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

interface MapHeaderMobileProps {
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
	onFiltersChange?: (filters: Partial<MapHeaderMobileProps['filters']>) => void;
	resultCount?: number;
}

export default function MapHeaderMobile({
	query,
	searchTerm,
	location,
	onSearchTermChange,
	onLocationChange,
	onLocationSelect,
	filters,
	onFiltersChange,
	resultCount = 0
}: MapHeaderMobileProps) {
	const data = useFragment(MapHeaderFragment, query);
	const [showMobileScene, setShowMobileScene] = useState(false);

	return (
		<Navbar
			maxWidth='full'
			isBordered
			position='static'
			classNames={{
				base: 'bg-background/95 backdrop-blur-md',
				wrapper: 'px-4',
				content: 'gap-0 w-full'
			}}
			isBlurred={false}
		>
			{/* Single NavbarContent for full-width layout */}
			<NavbarContent className='w-full gap-2 flex-nowrap'>
				{/* Logo - minimal size for mobile */}
				<NavbarItem className='flex-shrink-0'>
					<Link href={links.landing} className='font-medium text-inherit flex items-center'>
						<Logo className='w-8 h-8' />
					</Link>
				</NavbarItem>

				{/* Full-width search input */}
				<NavbarItem className='flex-1 min-w-0'>
					<Input
						placeholder='Search jobs, specialities...'
						startContent={<SearchIcon className='text-foreground-600' size={16} />}
						variant='faded'
						size='sm'
						readOnly
						fullWidth
						onClick={() => setShowMobileScene(true)}
						className='cursor-pointer w-full'
						classNames={{
							input: 'cursor-pointer',
							inputWrapper: 'cursor-pointer bg-background/50 w-full'
						}}
					/>
				</NavbarItem>

				{/* Minimal auth section - only show if authenticated */}
				{data.viewer.__typename === 'Account' && (
					<NavbarItem className='flex-shrink-0'>
						<AuthNavigation rootQuery={data.viewer} />
					</NavbarItem>
				)}
			</NavbarContent>

			{/* Mobile Filter Scene - Full screen overlay */}
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
