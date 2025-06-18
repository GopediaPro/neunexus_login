import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    defaultChecked: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onCheckedChange: { action: 'toggled' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Toggle size="sm" defaultChecked={false} />
        <span className="text-sm text-gray-600">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle size="md" defaultChecked={false} />
        <span className="text-sm text-gray-600">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle size="lg" defaultChecked={false} />
        <span className="text-sm text-gray-600">Large</span>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="flex flex-col items-center gap-2">
        <Toggle defaultChecked={false} />
        <span className="text-sm text-gray-600">Off</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle defaultChecked={true} />
        <span className="text-sm text-gray-600">On</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle defaultChecked={false} disabled />
        <span className="text-sm text-gray-600">Disabled</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [isChecked, setIsChecked] = useState(false);
    
    return (
      <div className="flex flex-col items-center gap-4">
        <Toggle 
          checked={isChecked} 
          onCheckedChange={setIsChecked}
        />
        <p className="text-sm text-gray-600">
          상태: {isChecked ? '켜짐' : '꺼짐'}
        </p>
        <button 
          onClick={() => setIsChecked(!isChecked)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          외부에서 토글하기
        </button>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Small</h3>
        <div className="flex items-center gap-4">
          <Toggle size="sm" defaultChecked={false} />
          <Toggle size="sm" defaultChecked={true} />
          <Toggle size="sm" defaultChecked={false} disabled />
          <Toggle size="sm" defaultChecked={true} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Medium</h3>
        <div className="flex items-center gap-4">
          <Toggle size="md" defaultChecked={false} />
          <Toggle size="md" defaultChecked={true} />
          <Toggle size="md" defaultChecked={false} disabled />
          <Toggle size="md" defaultChecked={true} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Large</h3>
        <div className="flex items-center gap-4">
          <Toggle size="lg" defaultChecked={false} />
          <Toggle size="lg" defaultChecked={true} />
          <Toggle size="lg" defaultChecked={false} disabled />
          <Toggle size="lg" defaultChecked={true} disabled />
        </div>
      </div>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between w-64">
        <span className="text-sm font-medium text-gray-700">알림 받기</span>
        <Toggle defaultChecked={true} />
      </div>
      <div className="flex items-center justify-between w-64">
        <span className="text-sm font-medium text-gray-700">다크 모드</span>
        <Toggle defaultChecked={false} />
      </div>
      <div className="flex items-center justify-between w-64">
        <span className="text-sm font-medium text-gray-700">자동 저장</span>
        <Toggle defaultChecked={true} />
      </div>
    </div>
  ),
};