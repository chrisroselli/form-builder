'use client';

import type React from 'react';
import { useState } from 'react';
import type { FormElement, FormElementType, FormRow } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import FormElementEditor from './form-element-editor';
import FormElementRenderer from './form-element-renderer';
import { Button } from './ui/button';
import { Trash2, MoveVertical, Plus, Grid, GripVertical } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { Droppable, Draggable, DragDropContext } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';

type ColumnCount = 1 | 2 | 3;

interface FormCanvasProps {
  formRows: FormRow[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void;
  onRemoveElement: (id: string) => void;
  onAddElement: (
    type: FormElementType,
    rowId?: string,
    colIndex?: number,
    columnWidth?: ColumnCount
  ) => void;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onMoveElement: (
    elementId: string,
    sourceRowId: string,
    targetRowId: string,
    targetIndex: number
  ) => void;
  setFormRows: React.Dispatch<React.SetStateAction<FormRow[]>>;
}

export default function FormCanvas({
  formRows,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onRemoveElement,
  onAddElement,
  onAddRow,
  onRemoveRow,
  onMoveElement,
  setFormRows,
}: FormCanvasProps) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState<ColumnCount>(1);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, source, destination, type } = result;

    // Handle row reordering
    if (type === 'row') {
      if (source.index !== destination.index) {
        setFormRows((prevRows) => {
          const reorderedRows = Array.from(prevRows);
          const [removed] = reorderedRows.splice(source.index, 1);
          reorderedRows.splice(destination.index, 0, removed);
          return reorderedRows;
        });
      }
      return;
    }

    // Handle element reordering within rows
    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      onMoveElement(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    }
  };

  const selectedElement = formRows
    .flatMap((row) => row.elements)
    .find((element) => element.id === selectedElementId);

  // Function to add an empty row with column placeholders
  const addEmptyColumnsRow = (colCount: ColumnCount) => {
    const rowId = `row-${Date.now()}`;

    // Create empty placeholder elements for each column
    const placeholderElements: FormElement[] = Array.from({
      length: colCount,
    }).map(
      (_, index) =>
        ({
          id: `placeholder-${Date.now()}-${index}`,
          type: 'placeholder', // Special type to indicate this is just a placeholder
          label: `Column ${index + 1}`,
          placeholder: 'Drop elements here',
          required: false,
          columns: colCount,
          isPlaceholder: true, // Add this flag to identify placeholders
        } as FormElement)
    );

    // Create a new row with empty columns
    const newRow: FormRow = {
      id: rowId,
      elements: placeholderElements,
      columnCount: colCount, // Store the column count in the row
    };

    // Add the new row to the form
    setFormRows((prevRows) => [...prevRows, newRow]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle>Form Canvas</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-none border-r h-8 px-3',
                    columnCount === 1 ? 'bg-primary/10 text-primary' : ''
                  )}
                  onClick={() => setColumnCount(1)}
                >
                  <div className="w-4 h-4 bg-current rounded-sm mr-1"></div>1
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-none border-r h-8 px-3',
                    columnCount === 2 ? 'bg-primary/10 text-primary' : ''
                  )}
                  onClick={() => setColumnCount(2)}
                >
                  <div className="flex gap-0.5 mr-1">
                    <div className="w-2 h-4 bg-current rounded-sm"></div>
                    <div className="w-2 h-4 bg-current rounded-sm"></div>
                  </div>
                  2
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-none h-8 px-3',
                    columnCount === 3 ? 'bg-primary/10 text-primary' : ''
                  )}
                  onClick={() => setColumnCount(3)}
                >
                  <div className="flex gap-0.5 mr-1">
                    <div className="w-1.5 h-4 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-4 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-4 bg-current rounded-sm"></div>
                  </div>
                  3
                </Button>
              </div>
              <Button
                className="text-white"
                size="sm"
                onClick={() => addEmptyColumnsRow(columnCount)}
              >
                <Plus size={14} className="mr-1 text-white" /> Add Row
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              {formRows.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
                  <p className="text-gray-500 text-sm">
                    Your form is empty - Start by adding a row
                  </p>
                </div>
              ) : (
                <Droppable droppableId="form-rows" type="row">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-6"
                    >
                      {formRows.map((row, rowIndex) => (
                        <Draggable
                          key={row.id}
                          draggableId={`row-${row.id}`}
                          index={rowIndex}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                'border rounded-md p-4',
                                activeRowId === row.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200',
                                snapshot.isDragging && 'shadow-lg'
                              )}
                            >
                              <CanvasRow
                                row={row}
                                rowIndex={rowIndex}
                                selectedElementId={selectedElementId}
                                onSelectElement={onSelectElement}
                                onUpdateElement={onUpdateElement}
                                onRemoveElement={onRemoveElement}
                                onAddElement={onAddElement}
                                onRemoveRow={onRemoveRow}
                                isActive={activeRowId === row.id}
                                setActiveRow={(active) =>
                                  setActiveRowId(active ? row.id : null)
                                }
                                setFormRows={setFormRows}
                                dragHandleProps={{
                                  ...provided.dragHandleProps,
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </DragDropContext>
            {formRows.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setFormRows([])}
                >
                  Reset Form
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface CanvasRowProps {
  row: FormRow;
  rowIndex: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void;
  onRemoveElement: (id: string) => void;
  onAddElement: (
    type: FormElementType,
    rowId?: string,
    colIndex?: number,
    columnWidth?: ColumnCount
  ) => void;
  onRemoveRow: (rowId: string) => void;
  isActive: boolean;
  setActiveRow: (active: boolean) => void;
  setFormRows: React.Dispatch<React.SetStateAction<FormRow[]>>;
  dragHandleProps?: React.HTMLAttributes<any>;
}

function CanvasRow({
  row,
  rowIndex,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onRemoveElement,
  onAddElement,
  onRemoveRow,
  isActive,
  setActiveRow,
  setFormRows,
  dragHandleProps,
}: CanvasRowProps) {
  // Handle dropping new elements from the sidebar
  const [{ isOver }, drop] = useDrop({
    accept: 'FORM_ELEMENT',
    drop: (item: { type: FormElementType }) => {
      // If this row has placeholders, replace the first placeholder with the actual element
      if (row.elements.some((el) => el.isPlaceholder)) {
        const placeholderIndex = row.elements.findIndex(
          (el) => el.isPlaceholder
        );
        if (placeholderIndex !== -1) {
          const columnWidth = row.elements[placeholderIndex].columns;

          // Remove the placeholder and add the real element
          setFormRows((prevRows) => {
            return prevRows.map((r) => {
              if (r.id === row.id) {
                const newElements = [...r.elements];

                // Create the new element with the same column width as the placeholder
                const newElement: FormElement = {
                  id: `element-${Date.now()}`,
                  type: item.type,
                  label: '',
                  placeholder: '',
                  required: false,
                  columns: columnWidth,
                };

                // Replace the placeholder with the new element
                newElements[placeholderIndex] = newElement;

                return {
                  ...r,
                  elements: newElements,
                };
              }
              return r;
            });
          });

          return { dropped: true };
        }
      }

      // Default behavior if no placeholders
      onAddElement(item.type, row.id);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Check if this row has column placeholders
  const hasPlaceholders = row.elements.some((el) => el.isPlaceholder);
  const columnCount = row.columnCount || 1;

  return (
    <div
      onMouseEnter={() => setActiveRow(true)}
      onMouseLeave={() => setActiveRow(false)}
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div
            {...dragHandleProps}
            className="cursor-grab p-1 mr-2 hover:bg-gray-100 rounded text-gray-500"
          >
            <GripVertical size={16} />
          </div>
          <Grid size={16} className="mr-2 text-gray-500" />
          <span className="text-sm font-medium">Row {rowIndex + 1}</span>
          {columnCount > 1 && (
            <span className="ml-2 text-xs text-gray-500">
              ({columnCount} columns)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => onRemoveRow(row.id)}
            title="Remove Row"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <Droppable droppableId={row.id} direction="horizontal" type="element">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex flex-wrap gap-4 min-h-[100px] ${
              snapshot.isDraggingOver ? 'bg-primary/10' : ''
            } ${
              row.elements.length === 0
                ? 'border-2 border-dashed border-gray-200 rounded-md p-4'
                : ''
            }`}
          >
            {row.elements.length === 0 && !isOver ? (
              <div className="w-full text-center text-gray-500 text-sm">
                Drag elements here
              </div>
            ) : (
              row.elements.map((element, index) => {
                // Calculate width based on columns property
                const columnWidth = element.columns || 1;
                let widthClass = 'w-full'; // Default full width

                if (columnWidth === 2) {
                  widthClass = 'w-[calc(50%-0.5rem)]'; // Half width minus gap
                } else if (columnWidth === 3) {
                  widthClass = 'w-[calc(33.333%-0.667rem)]'; // Third width minus gap
                }

                // For placeholder elements, render a drop zone
                if (element.isPlaceholder) {
                  return (
                    <div
                      key={element.id}
                      className={`${widthClass} border-2 border-dashed rounded-md p-4 flex items-center justify-center min-h-[100px] ${
                        isOver
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <p className="text-sm text-gray-500 text-center">
                        Drop form elements here
                      </p>
                    </div>
                  );
                }

                // For regular elements, render as draggable
                return (
                  <Draggable
                    key={element.id}
                    draggableId={element.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${widthClass} border rounded-md p-3 ${
                          selectedElementId === element.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200'
                        }`}
                        onClick={() => onSelectElement(element.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab p-1 hover:bg-gray-100 rounded"
                            >
                              <MoveVertical size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                              {element.type.charAt(0).toUpperCase() +
                                element.type.slice(1)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveElement(element.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <FormElementRenderer element={element} />
                      </div>
                    )}
                  </Draggable>
                );
              })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
