import type { Meta, StoryObj } from '@storybook/react';
import { Categories } from './Categories';

const meta: Meta<typeof Categories> = {
  title: 'UI/Categories',
  component: Categories,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Categories>;

const sampleCategories = [
  { id: '1', name: 'All', count: 42 },
  { id: '2', name: 'React', count: 15 },
  { id: '3', name: 'TypeScript', count: 12 },
  { id: '4', name: 'Next.js', count: 8 },
  { id: '5', name: 'Tailwind CSS', count: 7 },
];

export const Default: Story = {
  args: {
    categories: sampleCategories,
  },
};

export const WithSelection: Story = {
  args: {
    categories: sampleCategories,
    selectedCategory: '2',
  },
};

export const WithoutCounts: Story = {
  args: {
    categories: sampleCategories,
    showCounts: false,
  },
};

export const Interactive: Story = {
  args: {
    categories: sampleCategories,
    selectedCategory: '1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on categories to select them.',
      },
    },
  },
}; 