
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";
import jest from 'eslint-plugin-jest'

export default tseslint.config(
    {
        files: ['**/*.ts'],
        ignores: ["build/*"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "@stylistic": stylistic,
            jest
        },
        rules: {
            '@stylistic/semi': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'warn',

            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',

            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { 'argsIgnorePattern': '^_' }
            ],
            '@typescript-eslint/unbound-method': 'error',
        },
    },
    {
        files: ['tests/**/*.test.ts'],
        rules: {
            // you should turn the original rule off *only* for test files
            '@typescript-eslint/unbound-method': 'off',
            'jest/unbound-method': 'error',
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    "checksVoidReturn": false
                }
            ]
        },
    }
);