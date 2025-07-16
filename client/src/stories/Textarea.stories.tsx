import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@/components/ui/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Design System/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '입력된 텍스트 값',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    error: {
      control: 'boolean',
      description: '에러 상태 여부',
    },
    helperText: {
      control: 'text',
      description: '하단 설명 텍스트',
    },
    variant: {
      control: 'select',
      options: ['default', 'code'],
      description: '스타일 종류',
    },
    rows: {
      control: 'number',
      description: '텍스트 영역 줄 수',
    },
    onChange: { action: 'changed' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 텍스트 영역 컴포넌트입니다. placeholder, error, helperText 등을 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: '입력해 주세요',
    error: false,
    helperText: '입력 예시입니다.',
    variant: 'default',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    value: '오류가 있습니다',
    error: true,
    helperText: '에러 메시지입니다.',
  },
};

export const CodeStyle: Story = {
  args: {
    value: 'const a = 10;',
    variant: 'code',
  },
};
