import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from '../components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '피그마 디자인 시스템을 적용한 Input 컴포넌트입니다. 라이트/다크 모드를 지원하며, 다양한 상태와 타입을 제공합니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input의 타입을 설정합니다'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'focused', 'error'],
      description: '강제로 상태를 설정할 때 사용합니다'
    },
    error: {
      control: 'text',
      description: '에러 메시지. 설정 시 에러 상태로 변경됩니다'
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트 (에러가 없을 때만 표시)'
    },
    placeholder: {
      control: 'text',
      description: 'placeholder 텍스트'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    showPasswordToggle: {
      control: 'boolean',
      description: '비밀번호 보기/숨기기 토글 (password 타입일 때만)'
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
    placeholder: '텍스트를 입력하세요',
    type: 'text'
  },
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 Input 컴포넌트입니다. 클릭하면 포커스 상태로 변경됩니다.'
      }
    }
  }
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'your@email.com',
  },
  parameters: {
    docs: {
      description: {
        story: '이메일 입력을 위한 Input 컴포넌트입니다.'
      }
    }
  }
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '8자 이상 입력',
    showPasswordToggle: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비밀번호 입력용 Input입니다. 눈 아이콘을 클릭하면 비밀번호를 보거나 숨길 수 있습니다.'
      }
    }
  }
};

export const WithError: Story = {
  args: {
    type: 'email',
    placeholder: 'your@email.com',
    error: '유효한 이메일을 입력해주세요',
    value: 'invalid-email'
  },
  parameters: {
    docs: {
      description: {
        story: '에러 상태의 Input입니다. 빨간색 테두리와 에러 아이콘이 표시됩니다.'
      }
    }
  }
};

export const WithHelperText: Story = {
  args: {
    type: 'text',
    placeholder: '사용자명',
    helperText: '3-20자 사이의 영문, 숫자만 가능합니다',
  },
  parameters: {
    docs: {
      description: {
        story: '도움말 텍스트가 있는 Input입니다. 사용자에게 입력 가이드를 제공합니다.'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: '수정할 수 없는 필드',
    disabled: true,
    value: '비활성화된 값'
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 Input입니다. 회색 배경과 흐린 텍스트로 표시됩니다.'
      }
    }
  }
};

export const Focused: Story = {
  args: {
    type: 'text',
    placeholder: '포커스된 상태',
    variant: 'focused'
  },
  parameters: {
    docs: {
      description: {
        story: '강제로 포커스 상태를 적용한 Input입니다. 파란색 테두리가 표시됩니다.'
      }
    }
  }
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '숫자만 입력',
    helperText: '숫자만 입력 가능합니다'
  }
};

export const Phone: Story = {
  args: {
    type: 'tel',
    placeholder: '010-1234-5678',
    helperText: '하이픈(-) 포함하여 입력해주세요'
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">기본 상태</h3>
        <Input placeholder="기본 상태 Input" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">포커스 상태</h3>
        <Input placeholder="포커스된 Input" variant="focused" />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">에러 상태</h3>
        <Input 
          placeholder="에러 상태 Input" 
          error="에러가 발생했습니다" 
          value="잘못된 값"
        />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">도움말 포함</h3>
        <Input 
          placeholder="도움말이 있는 Input" 
          helperText="이것은 도움말 텍스트입니다"
        />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">비밀번호 (토글)</h3>
        <Input 
          type="password" 
          placeholder="비밀번호" 
          showPasswordToggle={true}
        />
      </div>
      
      <div>
        <h3 className="mb-2 text-text-base-500 font-medium">비활성화 상태</h3>
        <Input 
          placeholder="비활성화된 Input" 
          disabled 
          value="수정 불가"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input 컴포넌트의 모든 상태를 한 번에 확인할 수 있습니다. 다크모드 토글로 테마 변경도 확인해보세요.'
      }
    },
    layout: 'padded'
  }
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      
      if (val && !val.includes('@')) {
        setError('이메일 형식이 아닙니다');
      } else {
        setError('');
      }
    };
    
    return (
      <div className="space-y-4">
        <h3 className="text-text-base-500 font-medium">실시간 검증 예제</h3>
        <Input
          type="email"
          placeholder="이메일을 입력하세요"
          value={value}
          onChange={handleChange}
          error={error}
          helperText="'@'를 포함한 이메일 형식을 입력해주세요"
        />
        <p className="text-sm text-text-base-300">
          입력값: {value || '(없음)'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실시간으로 입력값을 검증하는 인터랙티브 예제입니다.'
      }
    }
  }
};