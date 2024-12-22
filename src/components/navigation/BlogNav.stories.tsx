import type { Meta, StoryObj } from '@storybook/react';
import { BlogNav } from './BlogNav';

const meta = {
  title: 'Navigation/BlogNav',
  component: BlogNav,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BlogNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCallbacks: Story = {
  args: {
    onHomeClick: () => alert('Navigate to Home'),
    onBlogClick: () => alert('Navigate to Blog'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the navigation buttons to see the callbacks in action.',
      },
    },
  },
}; 