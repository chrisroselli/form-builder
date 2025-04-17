import type { FormElement } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { UseFormRegister, FieldErrors, Controller } from 'react-hook-form';

interface FormElementRendererProps {
  element: FormElement;
  preview?: boolean;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
  control?: any;
}

// Helper to format phone number as (xxx) xxx-xxxx
function formatPhoneNumber(value: string) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default function FormElementRenderer({
  element,
  preview = false,
  register,
  errors,
  control,
}: FormElementRendererProps) {
  const { id, type, label, placeholder, required, options, rows } = element;
  const inputId = `form-element-${id}`;
  const error = errors?.[id];

  // Don't render placeholder elements
  if (type === 'placeholder') {
    return null;
  }

  const renderFormElement = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'date':
        return (
          <Input
            id={inputId}
            type={type}
            placeholder={placeholder}
            className={`w-full ${error ? 'border-red-500' : ''}`}
            disabled={!preview}
            {...(register ? register(id) : {})}
          />
        );
      case 'tel': {
        const registered = register ? register(id) : {};
        const originalOnChange = (registered as any)?.onChange;
        return (
          <Input
            id={inputId}
            type={type}
            placeholder={placeholder || '(xxx) xxx-xxxx'}
            className={`w-full ${error ? 'border-red-500' : ''}`}
            disabled={!preview}
            {...registered}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const formatted = formatPhoneNumber(e.target.value);
              e.target.value = formatted;
              if (originalOnChange) originalOnChange(e);
            }}
          />
        );
      }
      case 'textarea':
        return (
          <Textarea
            id={inputId}
            placeholder={placeholder}
            rows={rows || 3}
            className={`w-full ${error ? 'border-red-500' : ''}`}
            disabled={!preview}
            {...(register ? register(id) : {})}
          />
        );
      case 'select':
        return register && control ? (
          <Controller
            name={id}
            control={control}
            render={({ field }) => (
              <Select
                disabled={!preview}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={inputId}
                  className={`w-full ${error ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : null;
      case 'checkbox':
        return register && control ? (
          <Controller
            name={id}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={inputId}
                  disabled={!preview}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor={inputId}>{label}</Label>
              </div>
            )}
          />
        ) : null;
      case 'radio':
        return (
          <RadioGroup disabled={!preview}>
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${inputId}-${index}`}
                  {...(register ? register(id) : {})}
                />
                <Label htmlFor={`${inputId}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'file':
        return (
          <Input
            id={inputId}
            type="file"
            className={`w-full ${error ? 'border-red-500' : ''}`}
            disabled={!preview}
            {...(register ? register(id) : {})}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {type !== 'checkbox' && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderFormElement()}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}
