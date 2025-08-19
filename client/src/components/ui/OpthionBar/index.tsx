import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface OpthionBarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 섹션 좌측 타이틀 셀의 고정 너비 */
  titleColWidth?: number | string;
}

const OpthionBarRoot = React.forwardRef<HTMLDivElement, OpthionBarRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-stroke-base-100 bg-fill-base-100',
          'shadow-sm'
        , className)}
        {...props}
      />
    );
  }
);
OpthionBarRoot.displayName = 'OpthionBarRoot';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleColWidth?: number | string;
}

const Section = ({ title, className, titleColWidth, children, ...props }: SectionProps) => {
  const gridTemplate = `minmax(${typeof titleColWidth === 'number' ? `${titleColWidth}px` : (titleColWidth ?? '60px')}, auto) 1fr`;

  return (
    <div
      className={cn(
        'grid items-stretch',
        'last:border-b-0',
        className
      )}
      style={{ 
        gridTemplateColumns: gridTemplate,
        borderBottom: '0.01px solid rgba(0, 0, 0, 0.1)'
      }}
      {...props}
    >
      <div className="bg-fill-alt-100 text-text-base-400 px-1.5 py-1 flex items-center justify-between">
        <span className="truncate text-[10px]">{title}</span>
      </div>
      <div className="px-1.5 py-1">
        {children}
      </div>
    </div>
  );
};

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 필드들의 열 수 (자동 반응형 정렬) */
  columns?: number;
  /** 필드 사이 간격 */
  gap?: number;
}

const Row = ({ className, columns = 6, gap = 3, ...props }: RowProps) => {
  return (
    <div
      className={cn(
        'grid items-center',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`
      }}
      {...props}
    />
  );
};

interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 세로 배치할 섹션들 사이의 간격 */
  gap?: number;
}

const Column = ({ className, gap = 0, ...props }: ColumnProps) => {
  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: `${gap}px` }}
      {...props}
    />
  );
};

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** 라벨 고정 폭 */
  labelWidth?: number | string;
  /** 선택된 상태 (검은 배경 + 흰색 글씨 + 점 표시) */
  selected?: boolean;
}

const Field = ({ className, label, labelWidth = 40, selected = false, children, ...props }: FieldProps) => {
  return (
    <div 
      className={cn(
        'flex items-center min-h-[20px] rounded border ',
        selected 
          ? 'bg-black border-black' 
          : 'bg-fill-alt-200 border-stroke-base-100',
        className
      )} 
      {...props}
    >
      {label !== undefined && (
        <div
          className={cn(
            "shrink-0 px-1 py-0.5 rounded-l text-[10px]",
            selected 
              ? 'text-white bg-black' 
              : 'text-text-base-400 bg-fill-base-100'
          )}
          style={{ width: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth }}
        >
          {label}
        </div>
      )}
      <div className="flex-1 min-w-0 px-1 py-0.5 flex items-center justify-between">
        <div className={cn('flex-1 min-w-0 text-[10px]', selected && 'text-white')}>
          {children}
        </div>
        {selected && (
          <div className="w-1 h-1 bg-white rounded-full ml-0.5 shrink-0"></div>
        )}
      </div>
    </div>
  );
};

const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('text-caption text-text-base-400', className)} {...props} />
);

const Control = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center gap-2', className)} {...props} />
);

const Actions = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-2', className)} {...props} />
);

const Divider = () => <div className="h-[1px] w-full bg-stroke-base-100" />;

const HorizontalDivider = () => <div className="col-span-full h-[1px] bg-stroke-base-100" />;

// 프리셋 컨트롤: 내부 UI와 동일 스타일 유지
const OpthionBarInput = Input;
const OpthionBarSelect = Select;
const OpthionBarButton = Button;

export const OpthionBar = Object.assign(OpthionBarRoot, {
  Column,
  Section,
  Row,
  Field,
  Label,
  Control,
  Actions,
  Divider,
  HorizontalDivider,
  Input: OpthionBarInput,
  Select: OpthionBarSelect,
  Button: OpthionBarButton,
});

export type { SectionProps, RowProps, FieldProps, ColumnProps };


