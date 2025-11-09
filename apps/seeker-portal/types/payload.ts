import type { SerializedEditorState } from 'lexical';

export interface PayloadPost {
	id: string;
	title: string;
	slug: string;
	content?: SerializedEditorState;
	heroImage?: PayloadMedia;
	publishedAt?: string;
	readingTime?: number;
	authors?: PayloadUser[];
	populatedAuthors?: PayloadAuthor[];
	categories?: PayloadCategory[];
	meta?: {
		title?: string;
		description?: string;
		image?: PayloadMedia;
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
	about?: string;
	avatar?: PayloadMedia;
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
