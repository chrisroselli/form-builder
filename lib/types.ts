export type FormElementType =
  | 'text'
  | 'email'
  | 'tel'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'radio'
  | 'date'
  | 'file'
  | 'placeholder';

export type ColumnCount = 1 | 2 | 3;

export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  rows?: number;
  columns?: ColumnCount;
  rowIndex?: number; // Track which row this element belongs to
  colIndex?: number; // Track which column this element is placed in
  isPlaceholder?: boolean; // Flag to identify placeholder elements
  validation?: {
    type?: 'name' | 'street' | 'city' | 'zip' | 'custom';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    patternMessage?: string;
  };
}

export interface FormRow {
  id: string;
  elements: FormElement[];
}

export interface ConfirmationData {
  title: string;
  message: string;
  primaryColor: string;
  secondaryColor: string;
  enableSMS: boolean;
  recaptchaSiteKey?: string;
}
