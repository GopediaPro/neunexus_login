import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Design System/Forms/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '폼 에러 메시지를 표시하는 컴포넌트입니다. 피그마 에러 색상을 적용하여 라이트/다크 모드를 지원합니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: '표시할 에러 메시지'
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

export const Default: Story = {
  args: {
    message: '이 필드는 필수 입력 항목입니다'
  },
  parameters: {
    docs: {
      description: {
        story: '기본 에러 메시지입니다. 피그마 에러 색상이 적용됩니다.'
      }
    }
  }
};

export const EmailValidation: Story = {
  args: {
    message: '유효한 이메일 형식을 입력해주세요'
  }
};

export const PasswordValidation: Story = {
  args: {
    message: '비밀번호는 최소 8자 이상이어야 합니다'
  }
};

export const ComplexValidation: Story = {
  args: {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다'
  }
};

export const ServerError: Story = {
  args: {
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요'
  }
};

export const NetworkError: Story = {
  args: {
    message: '네트워크 연결을 확인해주세요'
  }
};

export const Short: Story = {
  args: {
    message: '필수 항목입니다'
  }
};

export const Long: Story = {
  args: {
    message: '사용자명은 3자 이상 20자 이하의 영문, 숫자, 언더스코어(_)만 사용 가능하며, 영문으로 시작해야 합니다'
  }
};

export const ErrorTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">필수 입력 에러</h3>
        <ErrorMessage message="이 필드는 필수 입력 항목입니다" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">형식 검증 에러</h3>
        <ErrorMessage message="올바른 이메일 형식을 입력해주세요" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">길이 검증 에러</h3>
        <ErrorMessage message="비밀번호는 최소 8자 이상이어야 합니다" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">패턴 검증 에러</h3>
        <ErrorMessage message="비밀번호는 영문과 숫자를 포함해야 합니다" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">서버 에러</h3>
        <ErrorMessage message="이미 사용 중인 이메일입니다" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">네트워크 에러</h3>
        <ErrorMessage message="네트워크 연결을 확인해주세요" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 종류의 에러 메시지를 한 번에 확인할 수 있습니다.'
      }
    },
    layout: 'padded'
  }
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-text-base-500 font-medium">Input + ErrorMessage 조합</h3>
      <div className="space-y-1">
        <input
          type="email"
          placeholder="your@email.com"
          defaultValue="invalid-email"
          className="flex h-[3.125rem] w-full rounded-lg border border-stroke-base-100 bg-fill-base-100 text-text-base-500 px-3 py-3 text-caption focus-visible:outline-none placeholder:text-text-base-300"
        />
        <ErrorMessage message="유효한 이메일 형식을 입력해주세요" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input 컴포넌트와 함께 사용될 때의 모습입니다.'
      }
    }
  }
};