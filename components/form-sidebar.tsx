'use client';

import type React from 'react';
import type { FormElementType, FormElement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Type,
  AlignLeft,
  ListChecks,
  CheckSquare,
  Mail,
  Phone,
  Hash,
  Calendar,
  Radio,
  FileText,
} from 'lucide-react';
import { useDrag } from 'react-dnd';
import FormElementEditor from './form-element-editor';

interface FormSidebarProps {
  onAddElement: (type: FormElementType) => void;
  selectedElement: FormElement | null;
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void;
}

export default function FormSidebar({
  onAddElement,
  selectedElement,
  onUpdateElement,
}: FormSidebarProps) {
  const formElements = [
    {
      type: 'text' as FormElementType,
      icon: <Type size={18} />,
      label: 'Text Input',
    },
    {
      type: 'email' as FormElementType,
      icon: <Mail size={18} />,
      label: 'Email',
    },
    {
      type: 'tel' as FormElementType,
      icon: <Phone size={18} />,
      label: 'Telephone',
    },
    {
      type: 'number' as FormElementType,
      icon: <Hash size={18} />,
      label: 'Number',
    },
    {
      type: 'date' as FormElementType,
      icon: <Calendar size={18} />,
      label: 'Date',
    },
    {
      type: 'textarea' as FormElementType,
      icon: <AlignLeft size={18} />,
      label: 'Text Area',
    },
    {
      type: 'select' as FormElementType,
      icon: <ListChecks size={18} />,
      label: 'Select',
    },
    {
      type: 'checkbox' as FormElementType,
      icon: <CheckSquare size={18} />,
      label: 'Checkbox',
    },
    {
      type: 'radio' as FormElementType,
      icon: <Radio size={18} />,
      label: 'Radio',
    },
    {
      type: 'file' as FormElementType,
      icon: <FileText size={18} />,
      label: 'File Upload',
    },
  ];

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Form Elements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-500 mb-4">
          Drag elements to add them to your form
        </p>
        <div className="grid grid-cols-1 gap-2 pb-4">
          {formElements.map((element) => (
            <DraggableElement
              key={element.type}
              element={element}
              onAddElement={onAddElement}
            />
          ))}
        </div>
        <hr className="my-4" />
        <div className="pt-2">
          <CardTitle className="text-lg mb-4">Element Properties</CardTitle>
          {selectedElement ? (
            <FormElementEditor
              element={selectedElement}
              onUpdateElement={onUpdateElement}
            />
          ) : (
            <p className="text-sm text-gray-500">
              Select an element to edit its properties
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DraggableElementProps {
  element: {
    type: FormElementType;
    icon: React.ReactNode;
    label: string;
  };
  onAddElement: (type: FormElementType) => void;
}

function DraggableElement({ element, onAddElement }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_ELEMENT',
    item: { type: element.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`flex items-center p-2 border rounded-md cursor-grab bg-white hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="mr-2 text-gray-600">{element.icon}</div>
      <span>{element.label}</span>
    </div>
  );
}
