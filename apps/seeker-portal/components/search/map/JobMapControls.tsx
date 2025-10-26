'use client';

import { Button } from '@heroui/react';
import type { Map as LeafletMap } from 'leaflet';
import { Locate, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

interface JobMapControlsProps {
	map: LeafletMap | null;
}

export default function JobMapControls({ map }: JobMapControlsProps) {
	const handleZoomIn = () => {
		map?.zoomIn();
	};

	const handleZoomOut = () => {
		map?.zoomOut();
	};

	const handleReset = () => {
		map?.setView([20.5937, 78.9629], 5);
	};

	const handleLocate = () => {
		if (!map) return;

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				position => {
					map.setView([position.coords.latitude, position.coords.longitude], 12);
				},
				error => {
					console.error('Geolocation error:', error);
				}
			);
		}
	};

	return (
		<>
			{/* Zoom Controls - Right Side */}
			<div className='absolute right-4 top-4 flex flex-col gap-2 z-[1000]'>
				<Button
					isIconOnly
					variant='flat'
					onPress={handleZoomIn}
					aria-label='Zoom in'
					className='bg-background shadow-medium min-w-11 min-h-11'
				>
					<ZoomIn className='w-4 h-4' />
				</Button>
				<Button
					isIconOnly
					variant='flat'
					onPress={handleZoomOut}
					aria-label='Zoom out'
					className='bg-background shadow-medium min-w-11 min-h-11'
				>
					<ZoomOut className='w-4 h-4' />
				</Button>
				<Button
					isIconOnly
					variant='flat'
					onPress={handleReset}
					aria-label='Reset view'
					className='bg-background shadow-medium min-w-11 min-h-11'
				>
					<Maximize2 className='w-4 h-4' />
				</Button>
				<Button
					isIconOnly
					variant='flat'
					onPress={handleLocate}
					aria-label='My location'
					className='bg-background shadow-medium min-w-11 min-h-11'
				>
					<Locate className='w-4 h-4' />
				</Button>
			</div>
		</>
	);
}
