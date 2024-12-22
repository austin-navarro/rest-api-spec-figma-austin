import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedPicker } from './Segmented picker';

const meta: Meta<typeof SegmentedPicker> = {
  title: 'Icons/SegmentedPicker',
  component: SegmentedPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8 bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SegmentedPicker>;

export const Default: Story = {};

export const CustomSize: Story = {
  args: {
    className: 'w-12 h-12',
  },
};

export const CustomColor: Story = {
  args: {
    className: 'text-primary-blue w-8 h-8',
  },
};

export const WithBackground: Story = {
  args: {
    className: 'text-white w-8 h-8',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8 bg-grey-dark rounded-md">
        <Story />
      </div>
    ),
  ],
}; 