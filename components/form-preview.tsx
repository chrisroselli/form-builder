"use client"

import type { FormRow } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card"
import FormElementRenderer from "./form-element-renderer"
import { Button } from "./ui/button"

interface FormPreviewProps {
  formRows: FormRow[]
}

export default function FormPreview({ formRows }: FormPreviewProps) {
  // Filter out placeholder elements for the preview
  const filteredRows = formRows.map((row) => ({
    ...row,
    elements: row.elements.filter((el) => !el.isPlaceholder),
  }))

  const allElements = filteredRows.flatMap((row) => row.elements)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {allElements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your form is empty. Add rows and elements to see a preview.</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {filteredRows.map((row, rowIndex) => (
              <div key={row.id} className="flex flex-wrap -mx-2">
                {row.elements.map((element) => {
                  const columns = element.columns || 1
                  let widthClass = "w-full px-2" // Default full width

                  if (columns === 2) {
                    widthClass = "w-full md:w-1/2 px-2"
                  } else if (columns === 3) {
                    widthClass = "w-full md:w-1/3 px-2"
                  }

                  return (
                    <div key={element.id} className={widthClass}>
                      <FormElementRenderer element={element} preview={true} />
                    </div>
                  )
                })}
              </div>
            ))}
          </form>
        )}
      </CardContent>
      {allElements.length > 0 && (
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Form
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

