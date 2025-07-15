import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/input';

const BasicFormFieldWrapper = ({ fieldName, label, error, ...args }: any) => {
  const { control } = useForm({
    mode: 'onChange',
    defaultValues: { [fieldName]: '' }
  });

  return (
    <FormField
      name={fieldName}
      control={control}
      label={label}
      error={error}
      {...args}
    />
  );
};

const ValidatedFormFieldWrapper = ({ fieldName, label, validation, ...args }: any) => {
  const schema = z.object({
    [fieldName]: validation
  });

  const { control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { [fieldName]: '' }
  });

  return (
    <FormField
      name={fieldName}
      control={control}
      label={label}
      error={errors[fieldName]?.message}
      {...args}
    />
  );
};

const CompleteFormExample = () => {
  const loginSchema = z.object({
    email: z.string().email("유효한 이메일을 입력해주세요"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    username: z.string().min(3, "사용자명은 최소 3자 이상이어야 합니다")
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: ''
    }
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Form Data:', data);
    alert('폼이 제출되었습니다! (콘솔 확인)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <FormField
        name="email"
        control={control}
        label="이메일"
        render={(field, fieldId) => (
          <Input
            id={fieldId}
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...field}
          />
        )}
        error={errors.email?.message}
      />

      <FormField
        name="username"
        control={control}
        label="사용자명"
        render={(field, fieldId) => (
          <Input
            id={fieldId}
            type="text"
            placeholder="사용자명"
            error={errors.username?.message}
            helperText="3자 이상 입력해주세요"
            {...field}
          />
        )}
        error={errors.username?.message}
      />

      <FormField
        name="password"
        control={control}
        label="비밀번호"
        render={(field, fieldId) => (
          <Input
            id={fieldId}
            type="password"
            placeholder="8자 이상 입력"
            showPasswordToggle={true}
            error={errors.password?.message}
            {...field}
          />
        )}
        error={errors.password?.message}
      />

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-primary-500 text-text-contrast-500 py-3 rounded-lg hover:bg-primary-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        제출
      </button>
    </form>
  );
};

const meta: Meta<typeof BasicFormFieldWrapper> = {
  title: 'Design System/Forms/FormField',
  component: BasicFormFieldWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'react-hook-form Controller를 래핑한 FormField 컴포넌트입니다. Label, Input, ErrorMessage를 하나로 통합하여 폼 필드를 쉽게 구성할 수 있습니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    fieldName: {
      control: 'text',
      description: '필드명 (react-hook-form name)'
    },
    label: {
      control: 'text',
      description: '라벨 텍스트'
    },
    error: {
      control: 'text',
      description: '에러 메시지'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TextField: Story = {
  args: {
    fieldName: 'username',
    label: '사용자명',
    render: (field: any, fieldId: any) => (
      <Input
        id={fieldId}
        type="text"
        placeholder="사용자명을 입력하세요"
        {...field}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 텍스트 입력 필드입니다.'
      }
    }
  }
};

export const EmailField: Story = {
  args: {
    fieldName: 'email',
    label: '이메일',
    render: (field: any, fieldId: any) => (
      <Input
        id={fieldId}
        type="email"
        placeholder="your@email.com"
        {...field}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '이메일 입력을 위한 필드입니다.'
      }
    }
  }
};

export const PasswordField: Story = {
  args: {
    fieldName: 'password',
    label: '비밀번호',
    render: (field: any, fieldId: any) => (
      <Input
        id={fieldId}
        type="password"
        placeholder="8자 이상 입력"
        showPasswordToggle={true}
        {...field}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '비밀번호 입력 필드입니다. 토글 기능이 포함되어 있습니다.'
      }
    }
  }
};

export const WithError: Story = {
  args: {
    fieldName: 'email',
    label: '이메일',
    error: '유효한 이메일을 입력해주세요',
    render: (field: any, fieldId: any) => (
      <Input
        id={fieldId}
        type="email"
        placeholder="your@email.com"
        error="유효한 이메일을 입력해주세요"
        {...field}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '에러 상태의 FormField입니다. 에러 메시지가 하단에 표시됩니다.'
      }
    }
  }
};

export const WithHelperText: Story = {
  args: {
    fieldName: 'username',
    label: '사용자명',
    render: (field: any, fieldId: any) => (
      <Input
        id={fieldId}
        type="text"
        placeholder="사용자명"
        helperText="3-20자 사이의 영문, 숫자만 가능합니다"
        {...field}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '도움말 텍스트가 포함된 FormField입니다.'
      }
    }
  }
};

export const EmailValidation: Story = {
  render: () => (
    <ValidatedFormFieldWrapper
      fieldName="email"
      label="이메일 (실시간 검증)"
      validation={z.string().email("유효한 이메일을 입력해주세요")}
      render={(field: any, fieldId: any) => (
        <Input
          id={fieldId}
          type="email"
          placeholder="your@email.com"
          {...field}
        />
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Zod 스키마를 사용한 실시간 이메일 검증 예제입니다. 타이핑하면서 즉시 검증됩니다.'
      }
    }
  }
};

export const PasswordValidation: Story = {
  render: () => (
    <ValidatedFormFieldWrapper
      fieldName="password"
      label="비밀번호 (실시간 검증)"
      validation={z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다")}
      render={(field: any, fieldId: any) => (
        <Input
          id={fieldId}
          type="password"
          placeholder="8자 이상 입력"
          showPasswordToggle={true}
          {...field}
        />
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '비밀번호 길이 검증이 적용된 FormField입니다.'
      }
    }
  }
};

export const ComplexValidation: Story = {
  render: () => (
    <ValidatedFormFieldWrapper
      fieldName="username"
      label="사용자명 (복합 검증)"
      validation={z.string()
        .min(3, "최소 3자 이상이어야 합니다")
        .max(20, "최대 20자까지 가능합니다")
        .regex(/^[a-zA-Z0-9_]+$/, "영문, 숫자, 언더스코어만 사용 가능합니다")
        .regex(/^[a-zA-Z]/, "영문으로 시작해야 합니다")}
      render={(field: any, fieldId: any) => (
        <Input
          id={fieldId}
          type="text"
          placeholder="username123"
          helperText="영문으로 시작, 3-20자, 영문/숫자/언더스코어만"
          {...field}
        />
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '복잡한 검증 규칙이 적용된 FormField입니다. 여러 조건을 동시에 검사합니다.'
      }
    }
  }
};

export const CompleteForm: Story = {
  render: () => <CompleteFormExample />,
  parameters: {
    docs: {
      description: {
        story: '실제 사용되는 완전한 폼의 예제입니다. Zod 스키마 검증과 실시간 유효성 검사가 적용되어 있습니다.'
      }
    },
    layout: 'padded'
  }
};

export const FieldTypes: Story = {
  render: () => (
    <div className="space-y-6">
      <BasicFormFieldWrapper
        fieldName="text"
        label="텍스트 필드"
        render={(field: any, fieldId: any) => (
          <Input
            id={fieldId}
            type="text"
            placeholder="일반 텍스트"
            {...field}
          />
        )}
      />
      
      <BasicFormFieldWrapper
        fieldName="email"
        label="이메일 필드"
        render={(field: any, fieldId: any) => (
          <Input
            id={fieldId}
            type="email"
            placeholder="이메일"
            {...field}
          />
        )}
      />
      
      <BasicFormFieldWrapper
        fieldName="password"
        label="비밀번호 필드"
        render={(field: any, fieldId: any) => (
          <Input
            id={fieldId}
            type="password"
            placeholder="비밀번호"
            showPasswordToggle={true}
            {...field}
          />
        )}
      />
      
      <BasicFormFieldWrapper
        fieldName="number"
        label="숫자 필드"
        render={(field: any, fieldId: any) => (
          <Input
            id={fieldId}
            type="number"
            placeholder="숫자"
            {...field}
          />
        )}
      />
      
      <BasicFormFieldWrapper
        fieldName="tel"
        label="전화번호 필드"
        render={(field: any, fieldId: any) => (
          <Input
            id={fieldId}
            type="tel"
            placeholder="010-1234-5678"
            {...field}
          />
        )}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 타입의 FormField를 한 번에 확인할 수 있습니다.'
      }
    },
    layout: 'padded'
  }
};