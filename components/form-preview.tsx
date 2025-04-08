'use client';

import type { FormRow } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from './ui/card';
import FormElementRenderer from './form-element-renderer';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface FormPreviewProps {
  formRows: FormRow[];
  submitButtonTitle?: string;
  enableSMS?: boolean;
}

export default function FormPreview({
  formRows,
  submitButtonTitle = 'Submit Form',
  enableSMS = false,
}: FormPreviewProps) {
  // Filter out placeholder elements for the preview
  const filteredRows = formRows.map((row) => ({
    ...row,
    elements: row.elements.filter((el) => !el.isPlaceholder),
  }));

  const allElements = filteredRows.flatMap((row) => row.elements);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {allElements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Your form is empty. Add rows and elements to see a preview.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {filteredRows.map((row, rowIndex) => (
              <div key={row.id} className="flex flex-wrap -mx-2">
                {row.elements.map((element) => {
                  const columns = element.columns || 1;
                  let widthClass = 'w-full px-2'; // Default full width

                  if (columns === 2) {
                    widthClass = 'w-full md:w-1/2 px-2';
                  } else if (columns === 3) {
                    widthClass = 'w-full md:w-1/3 px-2';
                  }

                  return (
                    <div key={element.id} className={widthClass}>
                      <FormElementRenderer element={element} preview={true} />
                    </div>
                  );
                })}
              </div>
            ))}
            {enableSMS && (
              <div className="flex space-x-2">
                <Checkbox id="sms-disclaimer" required />
                <Label htmlFor="sms-disclaimer" className="text-xs italic">
                  By checking this box, you agree to receive text messages from
                  Connecticut Basement Systems related to appointment setting,
                  service informational, and marketing messages at the phone
                  number provided above. You may reply STOP to opt-out at any
                  time. Reply HELP for assistance. Messages and data rates may
                  apply. Message frequency will vary. Learn more on our{' '}
                  <a href="/privacy-policy.html">Privacy Policy</a> page and{' '}
                  <a href="/terms-of-use.html">Terms &amp; Conditions</a>.
                </Label>
              </div>
            )}
          </form>
        )}
      </CardContent>
      {allElements.length > 0 && (
        <CardFooter>
          <Button type="submit" className="text-white inline-block mx-auto">
            {submitButtonTitle}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
