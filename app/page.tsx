import FormBuilder from "@/components/form-builder"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
        <p className="text-gray-600 mb-8">Drag and drop elements from the sidebar to create your custom form.</p>
        <FormBuilder />
      </div>
    </main>
  )
}

