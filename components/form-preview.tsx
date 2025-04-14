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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

interface FormPreviewProps {
  formRows: FormRow[];
  submitButtonTitle?: string;
  enableSMS?: boolean;
  recaptchaSiteKey?: string;
}

export default function FormPreview({
  formRows,
  submitButtonTitle = 'Submit Form',
  enableSMS = false,
  recaptchaSiteKey,
}: FormPreviewProps) {
  // Load reCAPTCHA script
  useEffect(() => {
    if (recaptchaSiteKey) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [recaptchaSiteKey]);

  // Filter out placeholder elements for the preview
  const filteredRows = formRows.map((row) => ({
    ...row,
    elements: row.elements.filter((el) => !el.isPlaceholder),
  }));

  const allElements = filteredRows.flatMap((row) => row.elements);

  // Add telephone formatting effect
  useEffect(() => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach((phoneInput) => {
      phoneInput.addEventListener('input', function (e) {
        let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
        value = value
          .replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/, '($1) $2-$3')
          .trim();
        (e.target as HTMLInputElement).value = value;
      });
    });

    return () => {
      phoneInputs.forEach((phoneInput) => {
        phoneInput.removeEventListener('input', () => {});
      });
    };
  }, [filteredRows]);

  // Create a Zod schema based on form elements
  const createValidationSchema = () => {
    const schemaFields: Record<string, any> = {};

    allElements.forEach((element) => {
      const { id, type, label, validation } = element;
      let fieldSchema;

      if (type === 'checkbox') {
        fieldSchema = z.boolean().refine((val) => val === true, {
          message: `${label} is required`,
        });
      } else {
        let baseSchema = z.string();

        switch (type) {
          case 'text':
            if (validation?.type) {
              switch (validation.type) {
                case 'name':
                  baseSchema = baseSchema
                    .min(2, `${label} must be at least 2 characters`)
                    .regex(/^[a-zA-Z\s-']+$/, 'Please enter a valid name');
                  break;
                case 'street':
                  baseSchema = baseSchema
                    .min(5, `${label} must be at least 5 characters`)
                    .regex(
                      /^[a-zA-Z0-9\s.,-]+$/,
                      'Please enter a valid street address'
                    );
                  break;
                case 'city':
                  baseSchema = baseSchema
                    .min(2, `${label} must be at least 2 characters`)
                    .regex(/^[a-zA-Z\s-']+$/, 'Please enter a valid city name');
                  break;
                case 'zip':
                  baseSchema = baseSchema.regex(
                    /^\d{5}(-\d{4})?$/,
                    'Please enter a valid ZIP code'
                  );
                  break;
                case 'custom':
                  if (validation.minLength) {
                    baseSchema = baseSchema.min(
                      validation.minLength,
                      `${label} must be at least ${validation.minLength} characters`
                    );
                  }
                  if (validation.maxLength) {
                    baseSchema = baseSchema.max(
                      validation.maxLength,
                      `${label} must be at most ${validation.maxLength} characters`
                    );
                  }
                  if (validation.pattern) {
                    try {
                      const regex = new RegExp(validation.pattern);
                      baseSchema = baseSchema.regex(
                        regex,
                        validation.patternMessage || 'Invalid format'
                      );
                    } catch (e) {
                      console.error('Invalid regex pattern:', e);
                    }
                  }
                  break;
              }
            } else {
              baseSchema = baseSchema.min(
                2,
                `${label} must be at least 2 characters`
              );
            }
            break;
          case 'select':
            if (validation?.type === 'state' && element.options) {
              fieldSchema = z.string().superRefine((val, ctx) => {
                if (!val) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${label} is required`,
                  });
                } else if (!element.options?.includes(val)) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please select a valid state',
                  });
                }
              });
            } else {
              fieldSchema = z.string().min(1, `${label} is required`);
            }
            break;
          case 'email':
            baseSchema = baseSchema.email('Please enter a valid email address');
            break;
          case 'tel':
            baseSchema = baseSchema.regex(
              /^\(\d{3}\) \d{3}-\d{4}$/,
              'Please enter a valid phone number in the format (xxx) xxx-xxxx'
            );
            break;
        }

        // Set required to true if there's any validation
        if (validation || type === 'email' || type === 'tel') {
          element.required = true;
          baseSchema = baseSchema.min(1, `${label} is required`);
        }

        fieldSchema = baseSchema;
      }

      schemaFields[id] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const formSchema = createValidationSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: allElements.reduce((acc, element) => {
      if (element.type === 'checkbox') {
        acc[element.id] = false;
      } else {
        acc[element.id] = '';
      }
      return acc;
    }, {} as FormValues),
  });

  function onSubmit(data: FormValues) {
    console.log('Form submitted:', data);
    // Here you can add your form submission logic
  }

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormElementRenderer
                        element={element}
                        preview={true}
                        register={form.register}
                        errors={form.formState.errors}
                      />
                    </div>
                  );
                })}
              </div>
            ))}

            {recaptchaSiteKey && (
              <div className="form-group">
                <div
                  className="g-recaptcha"
                  data-sitekey={recaptchaSiteKey}
                ></div>
                <p className="italic text-sm">
                  *ReCaptcha will validate on website.
                </p>
              </div>
            )}

            {enableSMS && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms-disclaimer"
                  {...form.register('sms-disclaimer')}
                />
                <Label htmlFor="sms-disclaimer" className="text-xs italic">
                  By checking this box, you agree to receive text messages from
                  Connecticut Basement Systems related to appointment setting,
                  service informational, and marketing messages at the phone
                  number provided above. You may reply STOP to opt-out at any
                  time. Reply HELP for assistance. Messages and data rates may
                  apply. Message frequency will vary. Learn more on our
                  <a
                    href="/privacy-policy.html"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    Privacy Policy
                  </a>{' '}
                  page and
                  <a
                    href="/terms-of-use.html"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    Terms & Conditions
                  </a>
                  .
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full">
              {submitButtonTitle}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
