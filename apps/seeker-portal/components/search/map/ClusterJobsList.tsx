'use client';

import { Skeleton } from '@heroui/react';
import { useEffect, useState } from 'react';
import CompactJobCard from './CompactJobCard';

interface ClusterJob {
	id: string;
	slug: string;
	title: string;
	location?: string | null;
	minSalary?: number | null;
	maxSalary?: number | null;
	currency?: string | null;
	minExperience?: number | null;
	maxExperience?: number | null;
	type?: string | null;
	workMode?: string | null;
	skills?: string[] | null;
	organization?: {
		name: string;
		slug?: string | null;
		logoUrl?: string | null;
		verificationStatus?: {
			verified?: boolean;
		} | null;
	} | null;
}

interface ClusterJobsListProps {
	h3Index: string | null;
	clusterInfo?: {
		count: number;
		center: [number, number];
	} | null;
	filters: {
		searchTerm: string | null;
		location: string | null;
		minExperience: number | null;
		minSalary: number | null;
		maxSalary: number | null;
		proximityKm: number;
		workMode: readonly string[];
		jobType: readonly string[];
		sortBy: string;
	};
	onJobSelect?: (jobId: string) => void;
	className?: string;
}

/**
 * ClusterJobsList Component
 *
 * Displays a list of jobs from a specific H3 cluster.
 * Loads jobs when a cluster is selected and provides infinite scroll.
 */
export default function ClusterJobsList({ h3Index, clusterInfo, filters, onJobSelect, className = '' }: ClusterJobsListProps) {
	const [jobs, setJobs] = useState<ClusterJob[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Reset state when cluster changes
	useEffect(() => {
		if (!h3Index) {
			setJobs([]);
			setIsLoading(false);
			setHasMore(true);
			setError(null);
			return;
		}

		// Load initial jobs for the cluster
		loadClusterJobs(true);
	}, [h3Index, filters]); // loadClusterJobs changes with state, so excluding it is intentional

	const loadClusterJobs = (reset = false) => {
		if (!h3Index || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			// TODO: Replace with actual GraphQL query to cluster jobs endpoint
			// This is a placeholder implementation
			const mockJobs: ClusterJob[] = Array.from({ length: Math.min(20, clusterInfo?.count || 20) }, (_, i) => ({
				id: `job-${h3Index}-${i}`,
				slug: `job-${i}-slug`,
				title: `Sample Job ${i + 1} in Cluster`,
				location: 'Bangalore, Karnataka',
				minSalary: 50000 + i * 10000,
				maxSalary: 100000 + i * 15000,
				currency: 'INR',
				minExperience: Math.floor(i / 3),
				maxExperience: Math.floor(i / 3) + 3,
				type: ['FULL_TIME', 'PART_TIME', 'CONTRACT'][i % 3],
				workMode: ['REMOTE', 'HYBRID', 'OFFICE'][i % 3],
				skills: [`Skill ${i}`, `Technology ${i}`],
				organization: {
					name: `Company ${i + 1}`,
					slug: `company-${i}`,
					logoUrl: null,
					verificationStatus: { verified: i % 3 === 0 }
				}
			}));

			if (reset) {
				setJobs(mockJobs);
			} else {
				setJobs(prev => [...prev, ...mockJobs]);
			}

			// Simulate pagination end
			setHasMore(mockJobs.length === 20);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load cluster jobs');
		} finally {
			setIsLoading(false);
		}
	};

	const loadMoreJobs = () => {
		if (hasMore && !isLoading) {
			loadClusterJobs(false);
		}
	};

	if (!h3Index) {
		return (
			<div className={`text-center py-8 ${className}`}>
				<p className='text-sm text-foreground-500'>Click on a cluster to view jobs in that area</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`text-center py-8 ${className}`}>
				<p className='text-sm text-danger-600 mb-2'>Failed to load cluster jobs</p>
				<button type='button' onClick={() => loadClusterJobs(true)} className='text-xs text-primary-600 hover:underline'>
					Try again
				</button>
			</div>
		);
	}

	return (
		<div className={className}>
			{/* Cluster Header */}
			{clusterInfo && (
				<div className='mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200'>
					<h3 className='text-sm font-semibold text-primary-900 mb-1'>Selected Cluster</h3>
					<p className='text-xs text-primary-700'>{clusterInfo.count} jobs in this area</p>
					<p className='text-xs text-primary-600'>
						Center: {clusterInfo.center[0].toFixed(4)}, {clusterInfo.center[1].toFixed(4)}
					</p>
				</div>
			)}

			{/* Jobs List */}
			<div className='space-y-2'>
				{jobs.map(job => (
					<CompactJobCard
						key={job.id}
						job={job}
						onClick={() => onJobSelect?.(job.id)}
						className='border border-divider hover:border-primary-200'
					/>
				))}

				{/* Loading State */}
				{isLoading && (
					<div className='space-y-2'>
						{Array.from({ length: 3 }, (_, i) => `loading-${Date.now()}-${i}`).map(key => (
							<div key={key} className='p-3 border border-divider rounded-lg'>
								<Skeleton className='h-4 w-3/4 rounded mb-2' />
								<Skeleton className='h-3 w-1/2 rounded mb-2' />
								<div className='flex gap-2'>
									<Skeleton className='h-3 w-16 rounded' />
									<Skeleton className='h-3 w-16 rounded' />
								</div>
							</div>
						))}
					</div>
				)}

				{/* Load More Button */}
				{hasMore && !isLoading && jobs.length > 0 && (
					<button
						type='button'
						onClick={loadMoreJobs}
						className='w-full py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors'
					>
						Load more jobs ({clusterInfo?.count || 0} total)
					</button>
				)}

				{/* No More Results */}
				{!hasMore && jobs.length > 0 && <p className='text-center text-xs text-foreground-500 py-2'>All jobs in this cluster loaded</p>}
			</div>
		</div>
	);
}
