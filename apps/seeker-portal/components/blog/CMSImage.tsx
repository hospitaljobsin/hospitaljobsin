'use client';

import Image from 'next/image';
import type { ComponentProps } from 'react';

type CMSImageProps = ComponentProps<typeof Image>;

/**
 * Wrapper for Next.js Image component specifically for CMS images from S3.
 * Uses unoptimized mode to avoid issues with S3 image URLs.
 */
export function CMSImage(props: CMSImageProps) {
	return <Image {...props} />;
}
