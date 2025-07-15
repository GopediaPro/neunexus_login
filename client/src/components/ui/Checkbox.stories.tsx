import type { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: ComponentMeta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
  },
};

export default meta;

type Story = ComponentStoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CheckedAndDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
