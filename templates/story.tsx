import type { Meta, StoryObj } from '@storybook/react';
import { COMPONENT_NAME } from './COMPONENT_NAME';

const meta = {
  title: 'Components/COMPONENT_NAME',
  component: COMPONENT_NAME,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof COMPONENT_NAME>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'COMPONENT_NAME Content',
  },
};
