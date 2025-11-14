'use client';

import Image from 'next/image';
import type { ComponentProps } from 'react';

type CMSImageProps = ComponentProps<typeof Image> & {
	/**
	 * Whether this image is above the fold and should be loaded with priority
	 * @default false
	 */
	priority?: boolean;
};

/**
 * Optimized wrapper for Next.js Image component for CMS images from S3.
 * Implements Core Web Vitals optimizations:
 * - Automatic format selection (WebP/AVIF)
 * - Responsive sizes
 * - Lazy loading below fold
 * - Priority loading for hero images
 */
export function CMSImage({ priority = false, loading, ...props }: CMSImageProps) {
	return (
		<Image
			{...props}
			priority={priority}
			loading={priority ? undefined : loading || 'lazy'}
			// Enable automatic format optimization
			quality={85}
		/>
	);
}
