import 'server-only';
import type { PayloadPost, PayloadPostsResponse } from '@/types/payload';
import { env } from './env/client';

const CMS_GRAPHQL_ENDPOINT = `${env.NEXT_PUBLIC_CMS_URL}/api/graphql`;

// Disable SSL verification for local development with self-signed certificates
if (process.env.NODE_ENV === 'development') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

interface FetchPostsOptions {
	limit?: number;
	page?: number;
	where?: Record<string, unknown>;
}

export async function fetchPosts(options: FetchPostsOptions = {}): Promise<PayloadPostsResponse> {
	const { limit = 10, page = 1, where = {} } = options;

	const query = `
		query Posts($limit: Int, $page: Int, $where: Post_where) {
			Posts(limit: $limit, page: $page, where: $where) {
				docs {
					id
					title
					slug
					publishedAt
					heroImage {
						id
						url
						alt
						width
						height
						filename
					}
					populatedAuthors {
						id
						name
						about
						avatar {
							id
							url
							alt
							width
							height
							filename
						}
					}
					categories {
						id
						title
						slug
					}
					meta {
						title
						description
						image {
							id
							url
							alt
							width
							height
							filename
						}
					}
				}
				totalDocs
				limit
				totalPages
				page
				pagingCounter
				hasPrevPage
				hasNextPage
				prevPage
				nextPage
			}
		}
	`;

	try {
		const response = await fetch(CMS_GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables: {
					limit,
					page,
					where: {
						_status: { equals: 'published' },
						...where
					}
				}
			}),
			next: {
				revalidate: 60, // Revalidate every minute
				tags: ['cms-posts']
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch posts: ${response.statusText}`);
		}

		const result = await response.json();

		if (result.errors) {
			throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
		}

		return result.data.Posts;
	} catch (error) {
		console.error('Error fetching posts from CMS:', error);
		throw error;
	}
}

export async function fetchPostBySlug(slug: string): Promise<PayloadPost | null> {
	const query = `
		query PostBySlug($slug: String!) {
			Posts(where: { slug: { equals: $slug } }, limit: 1) {
				docs {
					id
					title
					slug
					content
					publishedAt
					heroImage {
						id
						url
						alt
						width
						height
						filename
					}
					populatedAuthors {
						id
						name
						about
						avatar {
							id
							url
							alt
							width
							height
							filename
						}
					}
					categories {
						id
						title
						slug
					}
					meta {
						title
						description
						image {
							id
							url
							alt
							width
							height
							filename
						}
					}
				}
			}
		}
	`;

	try {
		const response = await fetch(CMS_GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables: { slug }
			}),
			next: {
				revalidate: 60,
				tags: ['cms-posts', `cms-post-${slug}`]
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch post: ${response.statusText}`);
		}

		const result = await response.json();

		if (result.errors) {
			throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
		}

		const posts = result.data.Posts.docs;
		return posts.length > 0 ? posts[0] : null;
	} catch (error) {
		console.error('Error fetching post from CMS:', error);
		throw error;
	}
}
