import eslintConfigCityssm, {
  type Config,
  cspellWords,
  tseslint
} from 'eslint-config-cityssm'

const config = tseslint.config(eslintConfigCityssm, {
  files: ['**/*.ts'],
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        cspell: {
          words: [...cspellWords, 'naics', 'wsib']
        }
      }
    ]
  }
}) as Config

export default config
