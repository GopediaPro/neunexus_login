import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../components/ui/Select';

const meta: Meta<typeof Select> = {
  title: 'Design System/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    onChange: { action: 'changed' }, // Storybook에서 값 바꿨을 때 이벤트 확인용
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 셀렉트 박스 컴포넌트입니다. 옵션, 에러 상태, placeholder 등을 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    value: 'option1',
    placeholder: '선택하세요',
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 셀렉트 박스입니다.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    options: sampleOptions,
    value: 'option2',
    error: true,
    placeholder: '에러 있음',
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: 'option3',
    disabled: true,
  },
};
