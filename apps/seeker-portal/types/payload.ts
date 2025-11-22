import type { SerializedEditorState } from 'lexical';

export interface PayloadPost {
	id: string;
	title: string;
	slug: string;
	content?: SerializedEditorState;
	heroImage?: PayloadMedia;
	publishedAt?: string;
	updatedAt?: string;
	readingTime?: number;
	authors?: PayloadUser[];
	populatedAuthors?: PayloadAuthor[];
	populatedReviewers?: PayloadAuthor[];
	categories?: PayloadCategory[];
	careerDisclaimer?: SerializedEditorState;
	meta?: {
		title?: string;
		description?: string;
		image?: PayloadMedia;
		keywords?: string;
	};
}

export interface PayloadMedia {
	id: string;
	url: string;
	alt?: string;
	width?: number;
	height?: number;
	filename: string;
}

export interface PayloadCategory {
	id: string;
	title: string;
	slug: string;
}

export interface PayloadUser {
	id: string;
	name?: string;
}

export interface PayloadAuthor {
	id: string;
	name: string;
	credentials?: string;
	about?: string;
	avatar?: PayloadMedia;
	linkedinUrl?: string;
	twitterUrl?: string;
}

export interface PayloadPostsResponse {
	docs: PayloadPost[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}
