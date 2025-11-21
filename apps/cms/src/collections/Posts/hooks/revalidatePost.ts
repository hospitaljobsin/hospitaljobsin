import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

import type { Post } from '../../../payload-types';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

async function revalidateTag(tag: string, payload: BasePayload) {
	if (!REVALIDATE_SECRET) {
		payload.logger.warn('REVALIDATE_SECRET not set, skipping revalidation');
		return;
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SEEKER_PORTAL_URL}/api/revalidate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tag, secret: REVALIDATE_SECRET })
		});

		if (!response.ok) {
			const error = await response.json();
			payload.logger.error(`Failed to revalidate tag ${tag}: ${error.error}`);
		} else {
			payload.logger.info(`Successfully revalidated tag: ${tag}`);
		}
	} catch (error) {
		payload.logger.error(`Error revalidating tag ${tag}:`, error);
	}
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({ doc, previousDoc, req: { payload, context } }) => {
	if (!context.disableRevalidate) {
		if (doc._status === 'published') {
			payload.logger.info(`Revalidating post: ${doc.slug}`);
			await Promise.all([
				revalidateTag('cms-posts', payload),
				revalidateTag(`cms-post-${doc.slug}`, payload)
				// revalidateTag('posts-sitemap', payload)
			]);
		}

		if (previousDoc._status === 'published' && doc._status !== 'published') {
			payload.logger.info(`Revalidating unpublished post: ${previousDoc.slug}`);
			await Promise.all([
				revalidateTag('cms-posts', payload),
				revalidateTag(`cms-post-${previousDoc.slug}`, payload)
				// revalidateTag('posts-sitemap', payload)
			]);
		}
	}
	return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req: { payload, context } }) => {
	if (!context.disableRevalidate && doc?.slug) {
		payload.logger.info(`Revalidating deleted post: ${doc.slug}`);
		await Promise.all([
			revalidateTag('cms-posts', payload),
			revalidateTag(`cms-post-${doc.slug}`, payload)
			// revalidateTag('posts-sitemap', payload)
		]);
	}

	return doc;
};
