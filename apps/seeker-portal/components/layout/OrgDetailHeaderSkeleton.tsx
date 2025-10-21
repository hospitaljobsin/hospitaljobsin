'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import links from '@/lib/links';
import JobSearchAutocomplete from '../forms/JobSearchAutocomplete';
import Logo from '../Logo';

export default function OrgDetailHeaderSkeleton() {
	return (
		<div className='w-full flex flex-col bg-background-600 border-b border-foreground-300 sticky top-0 z-50'>
			<Navbar maxWidth='xl' className='bg-background-600'>
				<NavbarContent justify='center' className='flex-1 w-full flex gap-6'>
					<NavbarBrand className='flex items-center gap-4 text-foreground-500'>
						<Link href={links.landing} className='font-medium text-inherit'>
							<Logo />
						</Link>
						<Link href={links.landing} className='font-medium text-inherit truncate max-w-32 sm:max-w-xs flex-1 hidden sm:block'>
							{APP_NAME}
						</Link>
					</NavbarBrand>
					<NavbarItem className='w-full'>
						<JobSearchAutocomplete
							value=''
							onValueChange={() => {}}
							isDisabled
							placeholder='Search by Speciality or keyword'
							startContent={<SearchIcon size={16} className='text-foreground-500' />}
							fullWidth
							variant='bordered'
							className='hidden lg:block'
							inputProps={{
								classNames: {
									inputWrapper: 'bg-background'
								}
							}}
							autoComplete='off'
						/>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
		</div>
	);
}
