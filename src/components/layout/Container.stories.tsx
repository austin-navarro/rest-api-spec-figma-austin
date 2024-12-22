import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-grey-light p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <div className="h-64 w-full rounded-lg bg-white p-4 shadow-md">
        <h2 className="text-2xl font-bold">Default Container</h2>
        <p className="mt-2 text-grey-dark">
          This container has a max-width for larger screens
        </p>
      </div>
    ),
  },
};

export const Fluid: Story = {
  args: {
    fluid: true,
    children: (
      <div className="h-64 w-full rounded-lg bg-white p-4 shadow-md">
        <h2 className="text-2xl font-bold">Fluid Container</h2>
        <p className="mt-2 text-grey-dark">
          This container expands to fill the available width
        </p>
      </div>
    ),
  },
}; 