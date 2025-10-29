'use client';

import { Button } from '@heroui/react';
import { FileIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';

type ClusterInfo = {
	hexId: string;
	count: number;
	center: [number, number];
};

interface ClusterSheetProps {
	totalCount: number;
	isPending?: boolean;
	// Cluster support props
	selectedCluster?: ClusterInfo | null;
}

export default function FilterSheet({ totalCount, isPending, selectedCluster }: ClusterSheetProps) {
	const ref = useRef<SheetRef>(null);
	const [currentSnap, setCurrentSnap] = useState(2);

	// Enhanced snap points based on PRD specifications:
	// 0 = Hidden (fully closed) - 0
	// 1 = Tucked (handle + peek) - 120px
	// 2 = No cluster state (35% of viewport) - 0.35
	// 3 = Cluster selected (60% of viewport) - 0.6
	// 4 = Full screen (100% of viewport) - 1
	const snapPoints = [0, 120, 0.35, 0.6, 1];

	// Auto-snap based on cluster state
	useEffect(() => {
		if (selectedCluster) {
			// Snap to cluster state (index 3 - 60% viewport)
			ref.current?.snapTo(3);
		} else {
			// Snap to no-cluster state (index 2 - 35% viewport)
			ref.current?.snapTo(2);
		}
	}, [selectedCluster]);

	const handleSnapTo = (index: number) => {
		ref.current?.snapTo(index);
	};

	// Handle tap on handle to toggle between tucked and default state
	const handleHandleTap = () => {
		if (currentSnap <= 1) {
			// If tucked or hidden, go to default state
			handleSnapTo(selectedCluster ? 3 : 2);
		} else {
			// If expanded, go to tucked state
			handleSnapTo(1);
		}
	};

	// Render different content based on current state
	const renderContent = () => {
		// Tucked state - minimal handle
		if (currentSnap <= 1) {
			return (
				<div className='p-4 text-center'>
					<button
						type='button'
						className='w-12 h-1 bg-default-300 rounded-full mx-auto cursor-pointer block'
						onClick={handleHandleTap}
						aria-label='Expand cluster sheet'
					/>
					<p className='text-xs text-default-500 mt-2'>Pull up for jobs in area</p>
				</div>
			);
		}

		// No cluster state
		if (!selectedCluster && currentSnap === 2) {
			return (
				<div className='p-6 text-center'>
					<button
						type='button'
						className='w-12 h-1 bg-default-300 rounded-full mx-auto mb-4 cursor-pointer block'
						onClick={handleHandleTap}
						aria-label='Toggle cluster sheet'
					/>
					<div className='space-y-3 flex flex-col items-center justify-center'>
						<FileIcon className='text-foreground-400' />
						<h3 className='text-lg font-medium text-foreground-700'>No Jobs Found</h3>
						<p className='text-sm text-foreground-500 max-w-xs mx-auto'>Try zooming into an area to find jobs</p>
					</div>
				</div>
			);
		}

		// Cluster selected or full screen state
		return (
			<div className='flex flex-col h-full'>
				{/* Header */}
				<div className='p-4 border-b border-divider bg-background sticky top-0 z-10'>
					<div className='flex items-center justify-between'>
						<button
							type='button'
							className='w-12 h-1 bg-default-300 rounded-full cursor-pointer'
							onClick={handleHandleTap}
							aria-label='Toggle cluster sheet'
						/>
						{currentSnap >= 4 && (
							<Button
								isIconOnly
								size='sm'
								variant='light'
								onPress={() => handleSnapTo(selectedCluster ? 3 : 2)}
								aria-label='Close full screen'
							>
								<X size={16} />
							</Button>
						)}
					</div>

					{selectedCluster && (
						<div className='mt-3'>
							<h3 className='text-lg font-medium text-foreground-700'>📍 {selectedCluster.hexId || 'Selected Area'}</h3>
							<p className='text-sm text-foreground-500'>{selectedCluster.count} jobs available</p>
						</div>
					)}
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-6'>
					{selectedCluster ? (
						<div className='space-y-4'>
							<div className='text-center'>
								<div className='text-6xl mb-4'>📍</div>
								<h3 className='text-xl font-semibold text-foreground-700 mb-2'>{selectedCluster.hexId || 'Selected Area'}</h3>
								<p className='text-lg text-foreground-600 mb-4'>{selectedCluster.count} jobs found in this area</p>
								<p className='text-sm text-foreground-500'>Tap on individual job markers to see details</p>
							</div>
						</div>
					) : (
						<div className='text-center py-8'>
							<div className='text-6xl mb-4'>🗺️</div>
							<h3 className='text-xl font-semibold text-foreground-700 mb-2'>Explore Jobs on Map</h3>
							<p className='text-sm text-foreground-500'>
								Total jobs available: {totalCount}
								{isPending && ' (loading...)'}
							</p>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<Sheet
			ref={ref}
			isOpen={true}
			onClose={() => {}}
			initialSnap={selectedCluster ? 3 : 2}
			snapPoints={snapPoints}
			onSnap={snapIndex => setCurrentSnap(snapIndex)}
			disableScrollLocking={true}
			disableDismiss={currentSnap > 0 && currentSnap <= 2} // Prevent dismiss for persistent states, but allow full close
		>
			<Sheet.Container className='!bg-background !rounded-t-3xl !shadow-2xl !z-[100]'>
				<Sheet.Content className='!bg-background h-full'>{renderContent()}</Sheet.Content>
			</Sheet.Container>

			{/* Conditional Backdrop - only for full screen */}
			{currentSnap >= 4 && <Sheet.Backdrop onTap={() => handleSnapTo(selectedCluster ? 3 : 2)} className='!bg-black/40 !z-[1400]' />}
		</Sheet>
	);
}
