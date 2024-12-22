import type { Meta, StoryObj } from '@storybook/react';
import { TempLogoIcon } from './TempLogoIcon';

const meta: Meta<typeof TempLogoIcon> = {
  title: 'UI/TempLogoIcon',
  component: TempLogoIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TempLogoIcon>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const CustomColor: Story = {
  args: {
    size: 'lg',
    className: 'text-grey-dark',
  },
}; 