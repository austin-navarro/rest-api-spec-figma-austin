import React from 'react';
import '../src/styles/globals.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F5F5F5',
        },
        {
          name: 'dark',
          value: '#1A1A1A',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

export default preview; 