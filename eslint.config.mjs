import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Best practices
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-debugger": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      
      // React specific
      "react/no-unescaped-entities": "warn",
      "react/no-children-prop": "warn",
      "react/jsx-key": "error",
      
      // Next.js specific
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      
      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
      "@typescript-eslint/explicit-function-return-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // Performance
      "react-hooks/exhaustive-deps": "warn",
      
      // Code style
      "quotes": ["error", "single", { avoidEscape: true }],
      "semi": ["error", "never"],
      "comma-dangle": ["error", "only-multiline"],
    },
  },
]);

export default eslintConfig;
