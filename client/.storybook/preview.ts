import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/internal/theming';
import '@/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    darkMode: {
      dark: { 
        ...themes.dark,
        appBg: '#27313A',
        appContentBg: '#27313A',
        barBg: '#3C454D'
      },
      light: { 
        ...themes.normal,
        appBg: '#F9F8FD',
        appContentBg: '#F9F8FD'
      },
      stylePreview: true,
      classTarget: 'html',
      darkClass: 'dark',
      lightClass: 'light'
    },

    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile'
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet'
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1024px', height: '768px' },
          type: 'desktop'
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop'
        }
      }
    },

    docs: {
      theme: themes.light,
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },

    globalTypes: {
      theme: {
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: {
          title: 'Theme',
          icon: 'circlehollow',
          items: ['light', 'dark'],
          dynamicTitle: true,
        },
      },
    },
  }
};

export default preview;
