import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'
import prettierPlugin from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

// Base rules for the entire project
const baseRules = {
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-debugger': 'warn',
  'prefer-const': 'warn',
};

export default tseslint.config(
    { ignores: ['dist', 'build', 'coverage', '.vite'] },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,

    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: { ...globals.browser, ...globals.node },
        },

        plugins: {
            react,
            tailwindcss: tailwind,
            prettier: prettierPlugin,
        },

        settings: {
            react: { version: 'detect' },
            tailwindcss: {
                callees: ['clsx', 'ctl', 'classnames'],
                removeDuplicates: true,
            },
        },

        rules: {
            // Base rules
            ...baseRules,
            
            // React rules
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/no-unknown-property': ['error', { ignore: ['css'] }],
            
            // TypeScript rules
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            
            // Tailwind rules
            'tailwindcss/classnames-order': 'warn',
            'tailwindcss/no-contradicting-classname': 'error',
        },
    },
    configPrettier,
    {
        files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node, ...globals.vitest, ...globals.jest },
        },
        rules: { 'no-console': 'off' },
    },
)