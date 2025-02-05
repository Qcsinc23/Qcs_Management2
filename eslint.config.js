import antfu from '@antfu/eslint-config'
import eslintPluginA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginSecurity from 'eslint-plugin-security'

export default antfu(
  {
    plugins: {
      'security': eslintPluginSecurity,
      'jsx-a11y': eslintPluginA11y,
    },
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
    react: true,
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Type Safety
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Performance
      'react/no-useless-fragment': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Error Handling
      'no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      }],

      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'security/detect-eval-with-expression': 'error',

      // Best Practices
      'complexity': ['warn', 20],
      'max-lines-per-function': ['warn', {
        max: 200,
        skipBlankLines: true,
        skipComments: true,
      }],

      // Accessibility
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-role': 'warn',
    },
  },
  {
    files: ['**/*.md', '**/*.mdx', 'eslint.config.js'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
)
