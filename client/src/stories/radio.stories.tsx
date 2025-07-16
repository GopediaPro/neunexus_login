import type { Meta, StoryObj } from '@storybook/react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Radio } from '@/components/ui/Radio';

const meta: Meta<typeof Radio> = {
  title: 'Design System/Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 라디오 버튼 컴포넌트입니다. `disabled` 상태를 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup.Root defaultValue="1">
      <div className="flex items-center space-x-2">
        <Radio value="1" {...args} />
        <label>옵션 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="2" {...args} />
        <label>옵션 2</label>
      </div>
    </RadioGroup.Root>
  ),
  args: {
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 라디오 버튼입니다.',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup.Root defaultValue="1">
      <div className="flex items-center space-x-2">
        <Radio value="1" {...args} disabled />
        <label>옵션 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="2" {...args} disabled />
        <label>옵션 2</label>
      </div>
    </RadioGroup.Root>
  ),
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 라디오 버튼입니다.',
      },
    },
  },
};
