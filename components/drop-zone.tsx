import { useDrop } from "react-dnd"
import type { FormElementType } from "@/lib/types"

interface DropZoneProps {
  onAddElement: (type: FormElementType) => void
  className?: string
}

export default function DropZone({ onAddElement, className = "" }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "FORM_ELEMENT",
    drop: (item: { type: FormElementType }) => {
      onAddElement(item.type)
      return { dropped: true }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${
        isOver ? "border-primary bg-primary/10" : "border-gray-200"
      } ${className}`}
    >
      <p className="text-sm text-gray-500">{isOver ? "Drop here to add element" : "Drop form elements here"}</p>
    </div>
  )
}

