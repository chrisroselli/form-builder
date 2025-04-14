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
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface FormElementRendererProps {
  element: FormElement;
  preview?: boolean;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
}

export default function FormElementRenderer({
  element,
  preview = false,
  register,
  errors,
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
      case 'tel':
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
        return (
          <Select disabled={!preview}>
            <SelectTrigger
              id={inputId}
              className={`w-full ${error ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={inputId}
              disabled={!preview}
              {...(register ? register(id) : {})}
            />
            <Label htmlFor={inputId}>{label}</Label>
          </div>
        );
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
