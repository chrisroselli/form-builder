'use client';

import type { FormElement } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface FormElementEditorProps {
  element: FormElement;
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void;
}

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export default function FormElementEditor({
  element,
  onUpdateElement,
}: FormElementEditorProps) {
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const options = [...(element.options || []), newOption.trim()];
    onUpdateElement(element.id, { options });
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(element.options || [])];
    options.splice(index, 1);
    onUpdateElement(element.id, { options });
  };

  const handleAddUSStates = () => {
    onUpdateElement(element.id, { options: US_STATES });
  };

  return (
    <>
      <div className="space-y-2 mb-2">
        <Label htmlFor="label" className="font-bold">
          Label
        </Label>
        <Input
          id="label"
          value={element.label}
          onChange={(e) =>
            onUpdateElement(element.id, { label: e.target.value })
          }
        />
      </div>

      {element.type !== 'checkbox' && element.type !== 'radio' && (
        <div className="space-y-2 mb-2">
          <Label htmlFor="placeholder" className="font-bold">
            Placeholder
          </Label>
          <Input
            id="placeholder"
            value={element.placeholder}
            onChange={(e) =>
              onUpdateElement(element.id, { placeholder: e.target.value })
            }
          />
        </div>
      )}

      {element.type === 'text' && (
        <div className="space-y-2">
          <Label className="font-bold">Validation</Label>
          <Select
            value={element.validation?.type || 'select'}
            onValueChange={(value) => {
              if (value === 'select') {
                onUpdateElement(element.id, {
                  validation: undefined,
                });
              } else {
                onUpdateElement(element.id, {
                  validation: {
                    ...element.validation,
                    type: value as
                      | 'name'
                      | 'street'
                      | 'city'
                      | 'zip'
                      | 'custom',
                  },
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select validation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select type</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="street">Street</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="zip">Zip Code</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {element.validation?.type === 'custom' && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Label>Min Length</Label>
                  <Input
                    type="number"
                    placeholder="Min Length"
                    value={element.validation?.minLength || ''}
                    onChange={(e) =>
                      onUpdateElement(element.id, {
                        validation: {
                          ...element.validation,
                          minLength: Number(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label>Max Length</Label>
                  <Input
                    type="number"
                    placeholder="Max Length"
                    value={element.validation?.maxLength || ''}
                    onChange={(e) =>
                      onUpdateElement(element.id, {
                        validation: {
                          ...element.validation,
                          maxLength: Number(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Regex Pattern</Label>
                <Input
                  placeholder="Regex Pattern"
                  value={element.validation?.pattern || ''}
                  onChange={(e) =>
                    onUpdateElement(element.id, {
                      validation: {
                        ...element.validation,
                        pattern: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Pattern Error Message</Label>
                <Input
                  placeholder="Pattern Error Message"
                  value={element.validation?.patternMessage || ''}
                  onChange={(e) =>
                    onUpdateElement(element.id, {
                      validation: {
                        ...element.validation,
                        patternMessage: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      {element.type === 'select' && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 my-2">
            <input
              id={`required-select-${element.id}`}
              type="checkbox"
              checked={!!element.required}
              onChange={(e) =>
                onUpdateElement(element.id, { required: e.target.checked })
              }
            />
            <Label htmlFor={`required-select-${element.id}`}>Required</Label>
          </div>
          <Label className="font-bold">
            Options
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const options = [...(element.options || [])];
                    options[index] = e.target.value;
                    onUpdateElement(element.id, {
                      options,
                    });
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                >
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
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={handleAddOption}>
                <PlusCircle size={16} />
              </Button>
            </div>
            <Button
              onClick={() => {
                handleAddUSStates();
              }}
              className="bg-secondary"
            >
              Add All US States
            </Button>
          </div>
        </div>
      )}

      {element.type === 'radio' && (
        <div className="space-y-2">
          <Label className="font-bold">Radio Options</Label>
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const options = [...(element.options || [])];
                    options[index] = e.target.value;
                    onUpdateElement(element.id, { options });
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add new radio option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={handleAddOption}>
                <PlusCircle size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {element.type === 'textarea' && (
        <div className="space-y-2">
          <Label htmlFor="rows" className="font-bold">
            Rows
          </Label>
          <Input
            id="rows"
            type="number"
            value={element.rows || 10}
            onChange={(e) =>
              onUpdateElement(element.id, {
                rows: Number.parseInt(e.target.value) || 3,
              })
            }
          />
        </div>
      )}
    </>
  );
}
