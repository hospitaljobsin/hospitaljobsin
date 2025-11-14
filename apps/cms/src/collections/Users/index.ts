import type { CollectionConfig } from 'payload';

import { authenticated } from '../../access/authenticated';

export const Users: CollectionConfig = {
	slug: 'users',
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated
	},
	admin: {
		defaultColumns: ['name', 'email'],
		useAsTitle: 'name'
	},
	auth: true,
	fields: [
		{
			name: 'name',
			type: 'text'
		},
		{
			name: 'credentials',
			type: 'text',
			admin: {
				description: 'Professional credentials (e.g., "Healthcare Recruitment Specialist, 10+ years experience")'
			}
		},
		{
			name: 'about',
			type: 'textarea',
			admin: {
				description: 'A detailed bio about the author/reviewer'
			}
		},
		{
			name: 'avatar',
			type: 'relationship',
			relationTo: 'media' // this should match your Media collection slug
		},
		{
			name: 'linkedinUrl',
			type: 'text',
			admin: {
				description: 'LinkedIn profile URL (optional)'
			}
		},
		{
			name: 'twitterUrl',
			type: 'text',
			admin: {
				description: 'Twitter/X profile URL (optional)'
			}
		}
	],
	timestamps: true
};
