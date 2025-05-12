module.exports = {
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Formatting and style
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-console': ['warn', { 'allow': ['warn', 'error'] }],
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['warn', { 'code': 100, 'ignoreUrls': true, 'ignoreStrings': true }],
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
    
    // Arrow function related rules
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    
    // Spacing rules
    'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: ['jest.config.js', 'config.js'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};