import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  configPrettier,
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
    languageOptions: {
      globals: globals.node,
    },
  },
]
