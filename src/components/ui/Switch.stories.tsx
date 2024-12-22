import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    id: 'airplane-mode',
  },
};

export const WithLabel: Story = {
  args: {
    id: 'airplane-mode',
    label: 'Airplane Mode',
  },
};

export const WithDescription: Story = {
  args: {
    id: 'airplane-mode',
    label: 'Airplane Mode',
    description: 'Turn off all wireless connections',
  },
};

export const Checked: Story = {
  args: {
    id: 'airplane-mode',
    label: 'Airplane Mode',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'airplane-mode',
    label: 'Airplane Mode',
    disabled: true,
  },
}; 