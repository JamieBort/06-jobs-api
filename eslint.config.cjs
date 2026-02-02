// eslint.config.cjs config file for ESLint

// TODO: Refactor this file.

// TODO: Add rules so that the order is flagged if it is not in the correct order.
/* Example:
The rule we’re enforcing

All imports (require) come first.
App creation comes next.
Then middleware.
Then routes.
Then error handlers.
Then startup logic.

plugins: ["import"],
rules: {
  "import/first": "error",
  "import/newline-after-import": "error",
  "import/order": [
    "error",
    {
      groups: [
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index"
      ],
      "newlines-between": "always"
    }
  ]
}
*/

// TODO: Figure out and address the following
// 1. what the name of the file should be. What the file extension should be.
// 2. What the options array should contain considering we're using node express on the back end and "regular js on the front end."

const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
	{
		// All JS/JSM/CJS files
		files: ["**/*.{js,mjs,cjs}"],
		plugins: {
			js, // Base JavaScript rules
			// n: require("eslint-plugin-n"), // Node-specific rules
		},
		extends: [
			"js/recommended", // Recommended JavaScript rules
			// "plugin:n/recommended", // Recommended Node.js best practices
			// ...globals.jest   // Uncomment if using Jest tests
		],
		languageOptions: {
			globals: {
				...globals.node, // Node globals
				...globals.browser, // Browser globals (optional)
			},
		},
		rules: {
			"no-console": "error",
			"no-unused-vars": "error",
			// "no-unused-vars": ["error", { args: "all" }],
			// "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
		},
	},
	// CommonJS override for .js files
	{ files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
