import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from '@payloadcms/plugin-seo/fields';

import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor
} from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';
import { authenticated } from '../../access/authenticated';
import { Banner } from '../../blocks/Banner/config';
import { Code } from '../../blocks/Code/config';
import { FAQ } from '../../blocks/FAQ/config';
import { MediaBlock } from '../../blocks/MediaBlock/config';
import { generatePreviewPath } from '../../utilities/generatePreviewPath';
import { generateReadingTime } from './hooks/generateReadingTime';
import { populateAuthors } from './hooks/populateAuthors';
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost';

export const Posts: CollectionConfig<'posts'> = {
	slug: 'posts',
	access: {
		create: authenticated,
		delete: authenticated,
		read: authenticatedOrPublished,
		update: authenticated
	},
	// This config controls what's populated by default when a post is referenced
	// https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
	// Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
	defaultPopulate: {
		title: true,
		slug: true,
		categories: true,
		meta: {
			image: true,
			description: true
		}
	},
	admin: {
		defaultColumns: ['title', 'slug', 'updatedAt'],
		livePreview: {
			url: ({ data, req }) =>
				generatePreviewPath({
					slug: data?.slug,
					collection: 'posts',
					req
				})
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: data?.slug as string,
				collection: 'posts',
				req
			}),
		useAsTitle: 'title'
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true
		},
		{
			type: 'tabs',
			tabs: [
				{
					fields: [
						{
							name: 'heroImage',
							type: 'upload',
							relationTo: 'media'
						},
						{
							name: 'content',
							type: 'richText',
							editor: lexicalEditor({
								features: ({ rootFeatures }) => {
									return [
										...rootFeatures,
										HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
										BlocksFeature({ blocks: [Banner, Code, MediaBlock, FAQ] }),
										FixedToolbarFeature(),
										InlineToolbarFeature(),
										HorizontalRuleFeature()
									];
								}
							}),
							label: false,
							required: true
						}
					],
					label: 'Content'
				},
				{
					fields: [
						{
							name: 'relatedPosts',
							type: 'relationship',
							admin: {
								position: 'sidebar'
							},
							filterOptions: ({ id }) => {
								return {
									id: {
										not_in: [id]
									}
								};
							},
							hasMany: true,
							relationTo: 'posts'
						},
						{
							name: 'categories',
							type: 'relationship',
							admin: {
								position: 'sidebar'
							},
							hasMany: true,
							relationTo: 'categories'
						}
					],
					label: 'Meta'
				},
				{
					name: 'meta',
					label: 'SEO',
					fields: [
						OverviewField({
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
							imagePath: 'meta.image'
						}),
						MetaTitleField({
							hasGenerateFn: true
						}),
						MetaImageField({
							relationTo: 'media'
						}),

						MetaDescriptionField({}),
						{
							name: 'keywords',
							type: 'text',
							label: 'Keywords',
							admin: {
								description: 'Comma-separated keywords (optional, not used by Google for ranking)'
							}
						},
						PreviewField({
							// if the `generateUrl` function is configured
							hasGenerateFn: true,

							// field paths to match the target field for data
							titlePath: 'meta.title',
							descriptionPath: 'meta.description'
						})
					]
				}
			]
		},
		{
			name: 'careerDisclaimer',
			type: 'richText',
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
				}
			}),
			label: 'Career Information Disclaimer',
			admin: {
				description: 'Disclaimer for YMYL (Your Money or Your Life) content. Required for career advice posts.'
			}
		},
		{
			name: 'publishedAt',
			type: 'date',
			admin: {
				date: {
					pickerAppearance: 'dayAndTime'
				},
				position: 'sidebar'
			},
			hooks: {
				beforeChange: [
					({ siblingData, value }) => {
						if (siblingData._status === 'published' && !value) {
							return new Date();
						}
						return value;
					}
				]
			}
		},
		{
			name: 'authors',
			type: 'relationship',
			admin: {
				position: 'sidebar'
			},
			hasMany: true,
			relationTo: 'users'
		},
		{
			name: 'reviewedBy',
			type: 'relationship',
			admin: {
				position: 'sidebar',
				description: 'Expert reviewer for E-E-A-T credibility (e.g., Senior HR Manager)'
			},
			relationTo: 'users'
		},
		// This field is only used to populate the user data via the `populateAuthors` hook
		// This is because the `user` collection has access control locked to protect user privacy
		// GraphQL will also not return mutated user data that differs from the underlying schema
		{
			name: 'populatedAuthors',
			type: 'array',
			access: {
				update: () => false
			},
			admin: {
				disabled: true,
				readOnly: true
			},
			fields: [
				{
					name: 'id',
					type: 'text'
				},
				{
					name: 'name',
					type: 'text'
				},
				{
					name: 'about',
					type: 'text'
				},
				{
					name: 'credentials',
					type: 'text'
				},
				{
					name: 'linkedinUrl',
					type: 'text'
				},
				{
					name: 'twitterUrl',
					type: 'text'
				},
				{
					name: 'avatar',
					type: 'group',
					fields: [
						{
							name: 'id',
							type: 'text'
						},
						{
							name: 'url',
							type: 'text'
						},
						{
							name: 'alt',
							type: 'text'
						},
						{
							name: 'width',
							type: 'number'
						},
						{
							name: 'height',
							type: 'number'
						},
						{
							name: 'filename',
							type: 'text'
						}
					]
				}
			]
		},
		{
			name: 'populatedReviewer',
			type: 'group',
			access: {
				update: () => false
			},
			admin: {
				disabled: true,
				readOnly: true
			},
			fields: [
				{
					name: 'id',
					type: 'text'
				},
				{
					name: 'name',
					type: 'text'
				},
				{
					name: 'about',
					type: 'text'
				},
				{
					name: 'credentials',
					type: 'text'
				},
				{
					name: 'linkedinUrl',
					type: 'text'
				},
				{
					name: 'twitterUrl',
					type: 'text'
				},
				{
					name: 'avatar',
					type: 'group',
					fields: [
						{
							name: 'id',
							type: 'text'
						},
						{
							name: 'url',
							type: 'text'
						},
						{
							name: 'alt',
							type: 'text'
						},
						{
							name: 'width',
							type: 'number'
						},
						{
							name: 'height',
							type: 'number'
						},
						{
							name: 'filename',
							type: 'text'
						}
					]
				}
			]
		},
		{
			name: 'readingTime',
			type: 'number',
			admin: {
				hidden: true
			}
		},
		slugField()
	],
	hooks: {
		beforeValidate: [generateReadingTime],
		afterChange: [revalidatePost],
		afterRead: [populateAuthors],
		afterDelete: [revalidateDelete]
	},
	versions: {
		drafts: {
			autosave: {
				interval: 50 // We set this interval for optimal live preview
			},
			schedulePublish: true
		},
		maxPerDoc: 50
	}
};
