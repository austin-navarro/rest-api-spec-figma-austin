import type { Meta, StoryObj } from '@storybook/react';
import { Tab, TabGroup } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'Navigation/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    children: 'Tab Item',
  },
};

export const Active: Story = {
  args: {
    children: 'Active Tab',
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Tab with Icon',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
};

export const TabGroupHorizontal: Story = {
  decorators: [
    (Story) => (
      <TabGroup>
        <Story />
        <Tab>Second Tab</Tab>
        <Tab active>Active Tab</Tab>
        <Tab>Fourth Tab</Tab>
      </TabGroup>
    ),
  ],
  args: {
    children: 'First Tab',
  },
};

export const TabGroupVertical: Story = {
  decorators: [
    (Story) => (
      <TabGroup vertical>
        <Story />
        <Tab>Second Tab</Tab>
        <Tab active>Active Tab</Tab>
        <Tab>Fourth Tab</Tab>
      </TabGroup>
    ),
  ],
  args: {
    children: 'First Tab',
  },
}; 