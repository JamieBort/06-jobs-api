// eslint.config.cjs config file for ESLint

const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig } = require("eslint/config");

// const config = [
// 	{
// 		// All JS/JSM/CJS files
// 		files: ["**/*.{js,mjs,cjs}"],
// 		plugins: {
// 			js, // Base JavaScript rules
// 			// n: require("eslint-plugin-n"), // Node-specific rules
// 		},
// 		extends: [
// 			"js/recommended", // Recommended JavaScript rules
// 			// "plugin:n/recommended", // Recommended Node.js best practices
// 			// ...globals.jest   // Uncomment if using Jest tests
// 		],
// 		languageOptions: {
// 			globals: {
// 				...globals.node, // Node globals
// 				...globals.browser, // Browser globals (optional)
// 			},
// 		},
// 		rules: {
// 			"no-console": "error",
// 			"no-unused-vars": "error",
// 			// "no-unused-vars": ["error", { args: "all" }],
// 			// "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
// 		},
// 	},
// 	// CommonJS override for .js files
// 	{ files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
// ];

const config = [
	// 1. Global defaults (Applied to all files)
	js.configs.recommended,
	{
		rules: {
			"no-unused-vars": "error",
			"no-console": "error",
		},
	},

	// 2. Backend / Node.js Specifics
	{
		files: ["**/*.js"],
		ignores: ["public/**/*"], // Exclude the frontend files from this block
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "commonjs", // Assuming Express uses require()
			globals: {
				...globals.node,
			},
		},
	},

	// 3. Frontend / Public Directory Specifics
	{
		files: ["public/**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module", // Vanilla JS Modules use import/export
			globals: {
				...globals.browser,
			},
		},
		rules: {
			"no-alert": "error", // Example of a browser-specific rule // This might not be needed.
		},
	},
];

module.exports = defineConfig(config);
