import { Suggestion } from "./Suggestion";
import type { RenderSuggestionsListProps } from "./props";

export function Suggestions({
	suggestions,
	onSuggestionClick,
}: RenderSuggestionsListProps) {
	return (
		<div className="suggestions">
			{suggestions.map((suggestion, index) => (
				<Suggestion
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					title={suggestion.title}
					message={suggestion.message}
					partial={suggestion.partial}
					className={suggestion.className}
					onClick={() => onSuggestionClick(suggestion.message)}
				/>
			))}
		</div>
	);
}
