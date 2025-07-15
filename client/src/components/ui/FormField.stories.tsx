import type { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';

const meta: ComponentMeta<typeof FormField<FieldValues>> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        email: '',
      },
    });

    return (
      <FormField
        {...args}
        name="email"
        control={control}
        render={(
          { field }: { field: any },
          id: string
        ) => (
          <input
            id={id}
            {...field}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="이메일을 입력하세요"
          />
        )}
      />
    );
  },
};

export default meta;

type Story = ComponentStoryObj<typeof FormField<FieldValues>>;

export const Default: Story = {
  args: {
    label: '이메일',
  },
};

export const WithError: Story = {
  args: {
    label: '이메일',
    error: '이메일을 입력해주세요.',
  },
};
