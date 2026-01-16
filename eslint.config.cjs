// eslint.config.cjs config file for ESLint

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
      // "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
  },
  // CommonJS override for .js files
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
