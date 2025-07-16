// Switch.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/components/ui/Switch';



const meta: Meta<typeof Switch> = {
  title: 'Design System/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '스위치의 체크 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 스위치 컴포넌트입니다. checked, disabled 상태를 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 스위치입니다.',
      },
    },
  },
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
