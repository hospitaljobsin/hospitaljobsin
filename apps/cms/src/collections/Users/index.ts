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
			name: 'about',
			type: 'text'
		},
		{
			name: 'avatar',
			type: 'relationship',
			relationTo: 'media' // this should match your Media collection slug
		}
	],
	timestamps: true
};
