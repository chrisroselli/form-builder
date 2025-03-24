"use client"

import type { FormElement } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { PlusCircle, X } from "lucide-react"
import { useState } from "react"

interface FormElementEditorProps {
  element: FormElement
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export default function FormElementEditor({ element, onUpdateElement }: FormElementEditorProps) {
  const [newOption, setNewOption] = useState("")

  const handleAddOption = () => {
    if (!newOption.trim()) return

    const options = [...(element.options || []), newOption.trim()]
    onUpdateElement(element.id, { options })
    setNewOption("")
  }

  const handleRemoveOption = (index: number) => {
    const options = [...(element.options || [])]
    options.splice(index, 1)
    onUpdateElement(element.id, { options })
  }

  const handleAddUSStates = () => {
    onUpdateElement(element.id, { options: US_STATES })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Element Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={element.label}
            onChange={(e) => onUpdateElement(element.id, { label: e.target.value })}
          />
        </div>

        {element.type !== "checkbox" && element.type !== "radio" && (
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={element.placeholder}
              onChange={(e) => onUpdateElement(element.id, { placeholder: e.target.value })}
            />
          </div>
        )}

        {element.type === "select" && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const options = [...(element.options || [])]
                      options[index] = e.target.value
                      onUpdateElement(element.id, { options })
                    }}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                    <X size={16} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add new option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddOption()
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={handleAddOption}>
                  <PlusCircle size={16} />
                </Button>
              </div>
              <Button onClick={handleAddUSStates} className="w-full">
                Add All US States
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={element.required}
            onCheckedChange={(checked) => onUpdateElement(element.id, { required: checked === true })}
          />
          <Label htmlFor="required">Required</Label>
        </div>

        {element.type === "textarea" && (
          <div className="space-y-2">
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              value={element.rows || 3}
              onChange={(e) => onUpdateElement(element.id, { rows: Number.parseInt(e.target.value) || 3 })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

