import FormBuilder from '@/components/form-builder';

export default function Home() {
  return (
    <main className="container mx-auto bg-[#f6f6f6]">
      <div className="w-auto bg-white h-24 flex justify-left items-center gap-4 pl-5">
        <img
          src="https://cdn.treehouseinternetgroup.com/cms_core/images/branding/th/th-marketing-logo-2021.svg"
          alt="Treehouse Internet Group"
          className="h-16 w-auto"
        />
        <p className="text-primary font-bold text-xl border-l-2 border-primary pl-3">
          Form Builder
        </p>
      </div>
      <FormBuilder />
    </main>
  );
}
