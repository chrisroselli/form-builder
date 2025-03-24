import FormBuilder from '@/components/form-builder';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Treehouse Form Builder</h1>
        <FormBuilder />
      </div>
    </main>
  );
}
