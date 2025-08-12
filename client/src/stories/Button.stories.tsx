import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Forms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '버튼 안에 표시할 텍스트',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'focus', 'light'],
    },
    size: {
      control: 'select',
      options: ['default', 'compact', 'sidebar', 'tabSm', 'tabMd', 'view', 'auth'],
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태 여부',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '공통적으로 사용하는 버튼 컴포넌트입니다. `variant`, `size`, `loading` 등 다양한 상태를 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 버튼',
    variant: 'default',
    size: 'default',
    loading: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 스타일의 버튼입니다.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    children: '삭제',
    variant: 'destructive',
  },
};

export const Loading: Story = {
  args: {
    children: '로딩 중...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화',
    disabled: true,
  },
};
