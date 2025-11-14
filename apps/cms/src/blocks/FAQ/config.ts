import type { Block } from 'payload';

export const FAQ: Block = {
	slug: 'faq',
	interfaceName: 'FAQBlock',
	fields: [
		{
			name: 'faqs',
			type: 'array',
			label: 'FAQ Items',
			minRows: 1,
			fields: [
				{
					name: 'question',
					type: 'text',
					required: true,
					label: 'Question'
				},
				{
					name: 'answer',
					type: 'textarea',
					required: true,
					label: 'Answer'
				}
			]
		}
	]
};
