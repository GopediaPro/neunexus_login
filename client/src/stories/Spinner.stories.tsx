import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../components/ui/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Design System/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '작은 사이즈의 로딩 spinner 컴포넌트입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본 스피너입니다.',
      },
    },
  },
};
