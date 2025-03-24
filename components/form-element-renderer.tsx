import type { FormElement } from "@/lib/types"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"

interface FormElementRendererProps {
  element: FormElement
  preview?: boolean
}

export default function FormElementRenderer({ element, preview = false }: FormElementRendererProps) {
  const { id, type, label, placeholder, required, options, rows } = element
  const inputId = `form-element-${id}`

  // Don't render placeholder elements
  if (type === "placeholder") {
    return null
  }

  const renderFormElement = () => {
    switch (type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "date":
        return (
          <Input
            id={inputId}
            type={type}
            placeholder={placeholder}
            required={required}
            className="w-full"
            disabled={!preview}
          />
        )
      case "textarea":
        return (
          <Textarea
            id={inputId}
            placeholder={placeholder}
            required={required}
            rows={rows || 3}
            className="w-full"
            disabled={!preview}
          />
        )
      case "select":
        return (
          <Select disabled={!preview}>
            <SelectTrigger id={inputId} className="w-full">
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
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={inputId} required={required} disabled={!preview} />
            <Label htmlFor={inputId}>{label}</Label>
          </div>
        )
      case "radio":
        return (
          <RadioGroup disabled={!preview}>
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${inputId}-${index}`} />
                <Label htmlFor={`${inputId}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "file":
        return <Input id={inputId} type="file" required={required} className="w-full" disabled={!preview} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {type !== "checkbox" && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderFormElement()}
    </div>
  )
}

