import type { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Input } from './input';

const meta: ComponentMeta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: '입력하세요',
    disabled: false,
    helperText: '설명 문구입니다.',
    error: '',
    type: 'text',
  },
};

export default meta;

type Story = ComponentStoryObj<typeof Input>;

export const Default: Story = {};

export const WithText: Story = {
  args: {
    value: '기본 텍스트',
  },
};

export const WithError: Story = {
  args: {
    error: '에러가 발생했습니다.',
  },
};

export const PasswordToggle: Story = {
  args: {
    type: 'password',
    showPasswordToggle: true,
    placeholder: '비밀번호 입력',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화됨',
  },
};
