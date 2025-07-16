import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from '../components/ui/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  render: (args) => {
    const [checked, setChecked] = useState(args.defaultChecked ?? false);

    return (
      <Toggle
        {...args}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
  args: {
    defaultChecked: false,
    disabled: false,
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
