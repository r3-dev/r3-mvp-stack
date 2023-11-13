import prettierConfig from '@crashmax/prettier-config' assert { type: 'json' }

export default {
  ...prettierConfig,
  plugins: [
    ...prettierConfig.plugins,
    'prettier-plugin-astro'
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
