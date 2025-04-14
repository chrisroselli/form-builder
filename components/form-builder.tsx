'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { FormElementType, FormElement, FormRow } from '@/lib/types';
import FormCanvas from './form-canvas';
import FormSidebar from './form-sidebar';
import FormPreview from './form-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import FormExport from './form-export';
import FormSettings from './form-settings';

export interface ConfirmationData {
  recaptchaSiteKey: string;
  recaptchaSecretKey: string;
  formName: string;
  customEmailSubject: string;
  notificationEmailAddresses: string;
  submitButtonTitle: string;
  enableSMS: boolean;
}

export default function FormBuilder() {
  const [formRows, setFormRows] = useState<FormRow[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
    formName: '',
    customEmailSubject: '',
    notificationEmailAddresses: '',
    submitButtonTitle: 'Submit',
    enableSMS: false,
  });

  // Helper function to get all form elements from all rows
  const getAllFormElements = (): FormElement[] => {
    return formRows.flatMap((row) =>
      row.elements.filter((el) => !el.isPlaceholder)
    );
  };

  const addElement = (
    type: FormElementType,
    rowId?: string,
    colIndex?: number,
    columnWidth?: 1 | 2 | 3
  ) => {
    const newElement: FormElement = {
      id: `element-${Date.now()}`,
      type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      columns: columnWidth || 1, // Use provided column width or default to full width
    };

    // Add to the last row if no rowId is provided, or create a new row if none exist
    if (!rowId) {
      setFormRows((prevRows) => {
        // If there are no rows, create a new one
        if (prevRows.length === 0) {
          const newRow = { id: `row-${Date.now()}`, elements: [newElement] };
          return [newRow];
        }

        // Otherwise add to the last row
        const lastRow = prevRows[prevRows.length - 1];
        return [
          ...prevRows.slice(0, -1),
          { ...lastRow, elements: [...lastRow.elements, newElement] },
        ];
      });
    } else {
      // If rowId is provided, add to that specific row
      setFormRows((prevRows) => {
        return prevRows.map((row) => {
          if (row.id === rowId) {
            // If colIndex is provided, insert at that position
            if (colIndex !== undefined) {
              const newElements = [...row.elements];
              newElements.splice(colIndex, 0, newElement);
              return { ...row, elements: newElements };
            }
            // Otherwise, add to the end of the row
            return { ...row, elements: [...row.elements, newElement] };
          }
          return row;
        });
      });
    }

    setSelectedElementId(newElement.id);
  };

  const addRow = () => {
    setFormRows((prevRows) => [
      ...prevRows,
      { id: `row-${Date.now()}`, elements: [] },
    ]);
  };

  const removeRow = (rowId: string) => {
    // Removed the check that prevents removing the last row
    setFormRows((prevRows) => {
      const filteredRows = prevRows.filter((row) => row.id !== rowId);
      // If we removed the row with the selected element, clear the selection
      if (
        selectedElementId &&
        !filteredRows.some((row) =>
          row.elements.some((el) => el.id === selectedElementId)
        )
      ) {
        setSelectedElementId(null);
      }
      return filteredRows;
    });
  };

  const updateElement = (id: string, updates: Partial<FormElement>) => {
    setFormRows((prevRows) => {
      return prevRows.map((row) => {
        const elementIndex = row.elements.findIndex((el) => el.id === id);
        if (elementIndex !== -1) {
          const updatedElements = [...row.elements];
          updatedElements[elementIndex] = {
            ...updatedElements[elementIndex],
            ...updates,
          };
          return { ...row, elements: updatedElements };
        }
        return row;
      });
    });
  };

  const removeElement = (id: string) => {
    setFormRows((prevRows) => {
      return prevRows.map((row) => {
        return {
          ...row,
          elements: row.elements.filter((element) => element.id !== id),
        };
      });
    });

    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const moveElement = (
    elementId: string,
    sourceRowId: string,
    targetRowId: string,
    targetIndex: number
  ) => {
    setFormRows((prevRows) => {
      // Find the source row and element
      const sourceRow = prevRows.find((row) => row.id === sourceRowId);
      if (!sourceRow) return prevRows;

      const elementIndex = sourceRow.elements.findIndex(
        (el) => el.id === elementId
      );
      if (elementIndex === -1) return prevRows;

      const element = sourceRow.elements[elementIndex];

      // Create new rows array with the element removed from source
      const updatedRows = prevRows.map((row) => {
        if (row.id === sourceRowId) {
          return {
            ...row,
            elements: row.elements.filter((el) => el.id !== elementId),
          };
        }
        return row;
      });

      // Add the element to the target row at the specified index
      return updatedRows.map((row) => {
        if (row.id === targetRowId) {
          const newElements = [...row.elements];
          newElements.splice(targetIndex, 0, element);
          return { ...row, elements: newElements };
        }
        return row;
      });
    });
  };

  const selectedElement = getAllFormElements().find(
    (element) => element.id === selectedElementId
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
        <Tabs defaultValue="editor">
          <TabsList className="w-full border-b">
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <FormCanvas
                  formRows={formRows}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onUpdateElement={updateElement}
                  onRemoveElement={removeElement}
                  onAddElement={addElement}
                  onAddRow={addRow}
                  onRemoveRow={removeRow}
                  onMoveElement={moveElement}
                  setFormRows={setFormRows}
                />
                <div className="mt-4">
                  <FormSettings
                    confirmationData={confirmationData}
                    setConfirmationData={setConfirmationData}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <FormSidebar
                  onAddElement={addElement}
                  selectedElement={
                    formRows
                      .flatMap((row) => row.elements)
                      .find((element) => element.id === selectedElementId) ||
                    null
                  }
                  onUpdateElement={updateElement}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <FormPreview
              formRows={formRows}
              submitButtonTitle={confirmationData.submitButtonTitle}
              enableSMS={confirmationData.enableSMS}
              recaptchaSiteKey={confirmationData.recaptchaSiteKey}
            />
          </TabsContent>

          <TabsContent value="export">
            <FormExport
              formRows={formRows}
              confirmationData={confirmationData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
}
