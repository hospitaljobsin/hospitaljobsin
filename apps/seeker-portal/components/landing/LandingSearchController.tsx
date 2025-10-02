'use client';
import { Button, Card } from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import links from '@/lib/links';
import JobSearchAutocomplete from '../forms/JobSearchAutocomplete';
import LocationAutocomplete from '../forms/LocationAutocomplete';

export function LandingSearchController({ isDisabled }: { isDisabled?: boolean }) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [locationInput, setLocationInput] = useState('');

	const handleSubmit = (e?: React.FormEvent<HTMLFormElement>, overrideSearchTerm?: string) => {
		if (e) {
			e.preventDefault();
		}
		const termToUse = overrideSearchTerm || searchTerm;
		if (termToUse && locationInput) {
			router.push(links.search(locationInput, termToUse));
			return;
		}
		if (termToUse) {
			router.push(links.search(undefined, termToUse));
			return;
		}
		if (locationInput) {
			router.push(links.search(locationInput));
			return;
		}
		router.push(links.search());
	};

	return (
		<Card className='p-6' shadow='none' fullWidth>
			<form onSubmit={handleSubmit} className='w-full rounded-lg flex flex-col gap-6'>
				<div className='w-full flex flex-col sm:flex-row gap-4 sm:gap-6'>
					<JobSearchAutocomplete
						name='searchTerm'
						label='Search by'
						variant='underlined'
						placeholder='Speciality or Keyword'
						value={searchTerm}
						isDisabled={isDisabled}
						onValueChange={setSearchTerm}
						onJobSelect={job => {
							setSearchTerm(job.displayName);
						}}
					/>
					<LocationAutocomplete
						name='location'
						label='Location'
						placeholder='e.g. Chennai'
						variant='underlined'
						allowsCustomValue
						value={locationInput}
						isDisabled={isDisabled}
						onValueChange={val => {
							console.log('on value change: ', val);
							setLocationInput(val);
						}}
						onChange={loc => {
							console.log('changed: ', loc);
							setLocationInput(loc.address.displayName || '');
						}}
						onSubmit={val => {
							setLocationInput(val);
						}}
					/>
				</div>
				<Button type='submit' className='min-w-44' color='primary' size='lg' startContent={<SearchIcon />} isDisabled={isDisabled}>
					Search Jobs
				</Button>
			</form>
		</Card>
	);
}
