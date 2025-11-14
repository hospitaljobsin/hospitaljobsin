import type { CollectionAfterReadHook } from 'payload';
import type { User } from 'src/payload-types';

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
	if (doc?.authors && doc?.authors?.length > 0) {
		const authorDocs: User[] = [];

		for (const author of doc.authors) {
			try {
				const authorDoc = await payload.findByID({
					id: typeof author === 'object' ? author?.id : author,
					collection: 'users',
					depth: 1 // Increase depth to get avatar relationship when possible
				});

				if (authorDoc) {
					authorDocs.push(authorDoc);
				}
			} catch {
				// swallow error for individual author fetches
			}
		}

		if (authorDocs.length > 0) {
			// Normalize avatars and build populatedAuthors. Use Promise.all because we may need to fetch media docs.
			doc.populatedAuthors = await Promise.all(
				authorDocs.map(async authorDoc => {
					let avatarMedia: {
						id: string;
						url?: string | null;
						alt?: string | null;
						width?: number | null;
						height?: number | null;
						filename?: string | null;
					} | null = null;

					try {
						const rawAvatar: any = (authorDoc as any).avatar;

						// Cases handled:
						// - null/undefined -> leave null
						// - string (id only) -> fetch media doc
						// - object with value -> use value (payload sometimes nests as { relationTo, value })
						// - populated media object -> use fields directly
						if (rawAvatar) {
							if (typeof rawAvatar === 'string') {
								// avatar is an id only
								const mediaDoc = await payload.findByID({ id: rawAvatar, collection: 'media' });
								if (mediaDoc) {
									avatarMedia = {
										id: mediaDoc.id,
										url: (mediaDoc as any).url,
										alt: (mediaDoc as any).alt,
										width: (mediaDoc as any).width,
										height: (mediaDoc as any).height,
										filename: (mediaDoc as any).filename
									};
								}
							} else if (rawAvatar.value && typeof rawAvatar.value === 'object') {
								// payload can return relation as { relationTo, value }
								const v = rawAvatar.value;
								avatarMedia = {
									id: v.id,
									url: v.url,
									alt: v.alt,
									width: v.width,
									height: v.height,
									filename: v.filename
								};
							} else if (rawAvatar.id && (rawAvatar.url || rawAvatar.filename)) {
								// already populated media-like object
								avatarMedia = {
									id: rawAvatar.id,
									url: rawAvatar.url,
									alt: rawAvatar.alt,
									width: rawAvatar.width,
									height: rawAvatar.height,
									filename: rawAvatar.filename
								};
							} else if (rawAvatar.id) {
								// has id but not populated fields; fetch media
								const mediaDoc = await payload.findByID({ id: rawAvatar.id, collection: 'media' });
								if (mediaDoc) {
									avatarMedia = {
										id: mediaDoc.id,
										url: (mediaDoc as any).url,
										alt: (mediaDoc as any).alt,
										width: (mediaDoc as any).width,
										height: (mediaDoc as any).height,
										filename: (mediaDoc as any).filename
									};
								}
							}
						}
					} catch (e) {
						// ignore avatar normalization failures per author
					}

					return {
						id: (authorDoc as any).id,
						name: (authorDoc as any).name,
						about: (authorDoc as any).about,
						credentials: (authorDoc as any).credentials,
						avatar: avatarMedia,
						linkedinUrl: (authorDoc as any).linkedinUrl,
						twitterUrl: (authorDoc as any).twitterUrl
					};
				})
			);
		}
	}

	// Populate reviewer data
	if (doc?.reviewedBy) {
		try {
			const reviewerId = typeof doc.reviewedBy === 'object' ? doc.reviewedBy?.id : doc.reviewedBy;
			const reviewerDoc = await payload.findByID({
				id: reviewerId,
				collection: 'users',
				depth: 1
			});

			if (reviewerDoc) {
				let avatarMedia: {
					id: string;
					url?: string | null;
					alt?: string | null;
					width?: number | null;
					height?: number | null;
					filename?: string | null;
				} | null = null;

				try {
					const rawAvatar: any = (reviewerDoc as any).avatar;
					if (rawAvatar) {
						if (typeof rawAvatar === 'string') {
							const mediaDoc = await payload.findByID({ id: rawAvatar, collection: 'media' });
							if (mediaDoc) {
								avatarMedia = {
									id: mediaDoc.id,
									url: (mediaDoc as any).url,
									alt: (mediaDoc as any).alt,
									width: (mediaDoc as any).width,
									height: (mediaDoc as any).height,
									filename: (mediaDoc as any).filename
								};
							}
						} else if (rawAvatar.value && typeof rawAvatar.value === 'object') {
							const v = rawAvatar.value;
							avatarMedia = {
								id: v.id,
								url: v.url,
								alt: v.alt,
								width: v.width,
								height: v.height,
								filename: v.filename
							};
						} else if (rawAvatar.id && (rawAvatar.url || rawAvatar.filename)) {
							avatarMedia = {
								id: rawAvatar.id,
								url: rawAvatar.url,
								alt: rawAvatar.alt,
								width: rawAvatar.width,
								height: rawAvatar.height,
								filename: rawAvatar.filename
							};
						} else if (rawAvatar.id) {
							const mediaDoc = await payload.findByID({ id: rawAvatar.id, collection: 'media' });
							if (mediaDoc) {
								avatarMedia = {
									id: mediaDoc.id,
									url: (mediaDoc as any).url,
									alt: (mediaDoc as any).alt,
									width: (mediaDoc as any).width,
									height: (mediaDoc as any).height,
									filename: (mediaDoc as any).filename
								};
							}
						}
					}
				} catch {
					// ignore avatar normalization failures
				}

				doc.populatedReviewer = {
					id: (reviewerDoc as any).id,
					name: (reviewerDoc as any).name,
					about: (reviewerDoc as any).about,
					credentials: (reviewerDoc as any).credentials,
					avatar: avatarMedia,
					linkedinUrl: (reviewerDoc as any).linkedinUrl,
					twitterUrl: (reviewerDoc as any).twitterUrl
				};
			}
		} catch {
			// swallow error for reviewer fetch
		}
	}

	return doc;
};
