import React from 'react';

export const FAQBlock: React.FC<{
	faqs: Array<{
		question: string;
		answer: string;
	}>;
}> = ({ faqs }) => {
	return (
		<div className='faq-block'>
			{faqs?.map((faq, index) => (
				<div key={index} className='faq-item'>
					<h3>{faq.question}</h3>
					<p>{faq.answer}</p>
				</div>
			))}
		</div>
	);
};
