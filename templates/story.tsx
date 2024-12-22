import type { Meta, StoryObj } from '@storybook/react';

// We'll add the component import when generating actual stories
const meta = {
  title: 'Example/Component',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
