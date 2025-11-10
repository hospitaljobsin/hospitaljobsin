import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import type { CollectionConfig } from 'payload';
import { fileURLToPath } from 'url';

import { anyone } from '../access/anyone';
import { authenticated } from '../access/authenticated';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
	slug: 'media',
	folders: true,
	access: {
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated
	},
	fields: [
		{
			name: 'alt',
			type: 'text'
			//required: true,
		},
		{
			name: 'caption',
			type: 'richText',
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
				}
			})
		}
	],
	upload: {
		adminThumbnail: ({ doc }) => {
			if (doc?.sizes?.thumbnail?.filename) {
				return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${doc.sizes.thumbnail.filename}`;
			}
			if (doc?.filename) {
				return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${doc.filename}`;
			}
			return undefined;
		},
		focalPoint: true,
		imageSizes: [
			{
				name: 'thumbnail',
				width: 300
			},
			{
				name: 'square',
				width: 500,
				height: 500
			},
			{
				name: 'small',
				width: 600
			},
			{
				name: 'medium',
				width: 900
			},
			{
				name: 'large',
				width: 1400
			},
			{
				name: 'xlarge',
				width: 1920
			},
			{
				name: 'og',
				width: 1200,
				height: 630,
				crop: 'center'
			}
		]
	}
};
