module.exports = {
	src: "./",
	language: "typescript",
	schema: "../../schema/schema.graphql",
	eagerEsModules: true,
	artifactDirectory: "./__generated__",
	excludes: [
		"**/node_modules/**",
		"**/__mocks__/**",
		"**/__tests__/**",
		"**/__generated__/**",
	],
};
