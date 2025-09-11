'use client';
import type { MyJobsHeaderFragment$key } from '@/__generated__/MyJobsHeaderFragment.graphql';
import links from '@/lib/links';
import { Link, Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import Logo from '../Logo';
import MyJobsTabs from '../my-jobs/MyJobsTabs';
import AuthNavigation from './AuthNavigation';
import IncompleteProfileBanner from './IncompleteProfileBanner';

export const MyJobsHeaderFragment = graphql`
  fragment MyJobsHeaderFragment on Query {
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

export default function MyJobsHeader({ query }: { query: MyJobsHeaderFragment$key }) {
	const data = useFragment(MyJobsHeaderFragment, query);
	invariant(data.viewer.__typename === 'Account', "Expected 'Account' node type");
	return (
		<div className='w-full flex flex-col bg-background border-b border-foreground-300 sticky top-0 z-50'>
			{data.viewer.__typename === 'Account' && <IncompleteProfileBanner account={data.viewer} />}
			<Navbar maxWidth='xl'>
				<NavbarBrand className='flex items-center gap-4 text-foreground-500'>
					<Link href={links.landing} className='font-medium text-inherit'>
						<Logo />
					</Link>
					<Link href={links.landing} className='font-medium text-inherit sm:flex items-center gap-4 hidden'>
						My Jobs
					</Link>
				</NavbarBrand>

				<NavbarContent justify='end'>
					<AuthNavigation rootQuery={data.viewer} />
				</NavbarContent>
			</Navbar>
			<div className='w-full max-w-7xl mx-auto flex items-center justify-between'>
				<MyJobsTabs />
			</div>
		</div>
	);
}
