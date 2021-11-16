/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'next/core-web-vitals', 'prettier'],
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      files: ['**/*.ts?(x)'],
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    {
      env: {
        commonjs: true
      },
      files: ['.eslintrc.js', '*.config.js'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  root: true,
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc'
        },
        groups: [
          ['builtin', 'external'],
          'parent',
          ['index', 'sibling'],
          'unknown',
          'type'
        ],
        'newlines-between': 'never'
      }
    ],
    'react/jsx-sort-props': 'error',
    'react/sort-prop-types': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true
      }
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        natural: true
      }
    ],
    'sort-vars': [
      'error',
      {
        ignoreCase: false
      }
    ]
  }
}
