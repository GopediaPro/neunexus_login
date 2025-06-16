import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  "addons": [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    'storybook-dark-mode', 
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },

  viteFinal: async (config) => {
    if (!config) {
      throw new Error('Vite config is undefined');
    }

    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src'
    };
    
    if (!config.css) {
      config.css = {};
    }

    config.css.postcss = {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    };
    
    return config;
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;