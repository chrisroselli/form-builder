export type FormElementType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "email"
  | "tel"
  | "number"
  | "file"
  | "placeholder" // Added placeholder type

export type ColumnCount = 1 | 2 | 3

export interface FormElement {
  id: string
  type: FormElementType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  rows?: number
  columns?: ColumnCount
  rowIndex?: number // Track which row this element belongs to
  colIndex?: number // Track which column this element is placed in
  isPlaceholder?: boolean // Flag to identify placeholder elements
}

export interface FormRow {
  id: string
  elements: FormElement[]
  columnCount?: ColumnCount // Store the column count for the row
}

