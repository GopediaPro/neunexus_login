import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from '../components/ui/Loading';

const meta: Meta<typeof Loading> = {
  title: 'Design System/Feedback/Loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '전체 화면 기준의 로딩 컴포넌트입니다. 중앙 정렬된 spinner와 텍스트를 포함합니다.',
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
        story: '기본 로딩 컴포넌트입니다.',
      },
    },
  },
};
