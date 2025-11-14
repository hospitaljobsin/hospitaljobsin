'use client';

import { Accordion, AccordionItem } from '@heroui/react';

interface FAQBlockProps {
	faqs: Array<{
		question: string;
		answer: string;
	}>;
}

export function FAQBlock({ faqs }: FAQBlockProps) {
	return (
		<div className='my-8 not-prose'>
			<Accordion variant='bordered'>
				{faqs?.map((faq, index) => (
					<AccordionItem key={index} title={faq.question} className='text-left'>
						<p className='text-default-600 prose'>{faq.answer}</p>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
