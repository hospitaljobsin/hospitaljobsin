import {
	consolidateHTMLConverters,
	convertLexicalToHTML,
	defaultEditorConfig,
	defaultEditorFeatures,
	HTMLConverterFeature,
	sanitizeServerEditorConfig
} from '@payloadcms/richtext-lexical';
import type { CollectionBeforeValidateHook } from 'payload';
import { calculateReadingTime } from '../../../utilities/calculateReadingTime';

export const generateReadingTime: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
	if (operation === 'create' || operation === 'update') {
		if (!data?.content) {
			return data;
		}

		const editorConfig = defaultEditorConfig;
		editorConfig.features = [...defaultEditorFeatures, HTMLConverterFeature({})];

		const sanitizedEditorConfig = await sanitizeServerEditorConfig(editorConfig, req.payload.config);

		const html = await convertLexicalToHTML({
			converters: consolidateHTMLConverters({ editorConfig: sanitizedEditorConfig }),
			data: data.content,
			req
		});

		return {
			...data,
			readingTime: calculateReadingTime(html)
		};
	}

	return data;
};
