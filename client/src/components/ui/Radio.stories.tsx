import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Radio } from './Radio';
import { Label } from './Label';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  render: (args) => {
    const [value, setValue] = React.useState('radio-1');

    return (
      <RadioGroup value={value} onValueChange={setValue} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Radio value="radio-1" id="r1" />
          <Label htmlFor="r1">Radio 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio value="radio-2" id="r2" />
          <Label htmlFor="r2">Radio 2</Label>
        </div>
      </RadioGroup>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {};
