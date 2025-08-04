'use client';

import type { FormRow } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import FormElementRenderer from './form-element-renderer';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useTreehouseValidator } from '@/hooks/use-treehouse-validator';

interface FormPreviewProps {
  formRows: FormRow[];
  submitButtonTitle?: string;
  enableSMS?: boolean;
  recaptchaSiteKey?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function FormPreview({
  formRows,
  submitButtonTitle = 'Submit Form',
  enableSMS = false,
  recaptchaSiteKey,
  primaryColor = '#000000',
  secondaryColor = '#000000',
}: FormPreviewProps) {
  const formRef = useRef<HTMLFormElement>(null);

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

  const form = useForm({
    defaultValues: allElements.reduce(
      (acc, element) => {
        if (element.type === 'checkbox') {
          acc[element.id] = false;
        } else {
          acc[element.id] = '';
        }
        return acc;
      },
      enableSMS ? ({ 'sms-disclaimer': false } as any) : ({} as any)
    ),
  });

  // Initialize Treehouse Form Validator
  const { validateAll } = useTreehouseValidator('form-preview', form, {
    disableSubmit: true,
    validateOnBlur: true,
    errorMessageClass: 'text-red-500 text-xs mt-1',
    errorMessageTag: 'span',
    errorInputClass: 'border-red-500',
    customValidators: {
      name: (field) => {
        const value = field.value.trim();
        if (!value)
          return `${field.getAttribute('data-label') || 'Name'} is required`;
        if (value.length < 2)
          return `${
            field.getAttribute('data-label') || 'Name'
          } must be at least 2 characters`;
        if (!/^[a-zA-Z\s-']+$/.test(value)) return 'Please enter a valid name';
      },
      street: (field) => {
        const value = field.value.trim();
        if (!value)
          return `${field.getAttribute('data-label') || 'Street'} is required`;
        if (value.length < 5)
          return `${
            field.getAttribute('data-label') || 'Street'
          } must be at least 5 characters`;
        if (!/^[a-zA-Z0-9\s.,-]+$/.test(value))
          return 'Please enter a valid street address';
      },
      city: (field) => {
        const value = field.value.trim();
        if (!value)
          return `${field.getAttribute('data-label') || 'City'} is required`;
        if (value.length < 2)
          return `${
            field.getAttribute('data-label') || 'City'
          } must be at least 2 characters`;
        if (!/^[a-zA-Z\s-']+$/.test(value))
          return 'Please enter a valid city name';
      },
      zip: (field) => {
        const value = field.value.trim();
        if (!value)
          return `${field.getAttribute('data-label') || 'ZIP'} is required`;
        if (!/^\d{5}$/.test(value))
          return 'Please enter a valid 5-digit ZIP code (numbers only)';
      },
      email: (field) => {
        const value = field.value.trim();
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return 'Please enter a valid email address';
      },
      phone: (field) => {
        const value = field.value.replace(/\D/g, '');
        if (!value) return 'Phone number is required';
        if (value.length !== 10) return 'Phone number must be 10 digits';
      },
    },
  });

  function onSubmit(data: any) {
    console.log('Form submitted:', data);
    // Here you can add your form submission logic
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorFields = validateAll();
    if (errorFields.length > 0) {
      // Focus on first error field
      errorFields[0].focus();
      errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // If no errors, submit the form
    form.handleSubmit(onSubmit)();
  };

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
          <div
            style={
              {
                '--form-secondary-color': secondaryColor,
              } as React.CSSProperties
            }
          >
            <form
              ref={formRef}
              id="form-preview"
              onSubmit={handleFormSubmit}
              className="space-y-6"
            >
              {filteredRows.map((row) => (
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
                          control={form.control}
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
                    *ReCaptcha will validate on live site.
                  </p>
                </div>
              )}

              {enableSMS && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="sms-disclaimer"
                      control={form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="sms-disclaimer"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="sms-disclaimer" className="text-xs italic">
                      By checking this box, you agree to receive text messages
                      from [company] related to appointment setting, service
                      informational, and marketing messages at the phone number
                      provided above. You may reply STOP to opt-out at any time.
                      Reply HELP for assistance. Messages and data rates may
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
                  {form.formState.errors['sms-disclaimer'] && (
                    <span className="text-red-500 text-xs ml-2">
                      {
                        form.formState.errors['sms-disclaimer']
                          .message as string
                      }
                    </span>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-secondary-color"
                style={{
                  backgroundColor: 'var(--form-secondary-color)',
                  color: '#fff',
                }}
              >
                {submitButtonTitle || 'Submit'}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
