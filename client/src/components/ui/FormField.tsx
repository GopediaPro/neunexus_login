import type { ReactElement } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type Path
} from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  render: (field: ControllerRenderProps<T>, fieldId: string) => ReactElement;
  error?: string;
}

export const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  render,
  error
}: FormFieldProps<T>) => {
  const fieldId = `field-${name}`;

  return (
    <div className="relative flex flex-col gap-2 w-full">
      <label
        htmlFor={fieldId}
        className="cursor-pointer text-font-primary font-medium text-left self-start"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => render(field, fieldId)}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
};
