import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

declare global {
  interface Window {
    ThFormValidator: any;
  }
}

interface TreehouseValidatorOptions {
  disableSubmit?: boolean;
  validateOnBlur?: boolean;
  errorMessageClass?: string;
  errorMessageTag?: string;
  errorInputClass?: string;
  customValidators?: Record<string, (field: HTMLInputElement) => string | void>;
}

// Fallback validator class when Treehouse script fails to load
class FallbackValidator {
  private form: HTMLFormElement;
  private options: TreehouseValidatorOptions;
  private customValidators: Record<
    string,
    (field: HTMLInputElement) => string | void
  >;

  constructor(formId: string, options: TreehouseValidatorOptions = {}) {
    const formElement = document.getElementById(formId) as HTMLFormElement;
    if (!formElement) {
      throw new Error(`Form with id "${formId}" not found`);
    }
    this.form = formElement;
    this.options = options;
    this.customValidators = options.customValidators || {};
  }

  validateField(field: HTMLInputElement): string | null {
    const value = field.value.trim();
    const fieldName = field.name;
    const dataValidate =
      field.getAttribute('data-validate-name') ||
      field.getAttribute('data-validate-email') ||
      field.getAttribute('data-validate-phone') ||
      field.getAttribute('data-validate-zip') ||
      field.getAttribute('data-validate-street') ||
      field.getAttribute('data-validate-city');

    // Check required
    if (field.hasAttribute('data-validate-required') && !value) {
      return `${field.getAttribute('data-label') || fieldName} is required`;
    }

    // Check custom validators
    if (dataValidate && this.customValidators[dataValidate]) {
      const error = this.customValidators[dataValidate](field);
      if (error) return error;
    }

    // Built-in validators
    if (field.hasAttribute('data-validate-email')) {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.hasAttribute('data-validate-phone')) {
      const phoneDigits = value.replace(/\D/g, '');
      if (value && phoneDigits.length !== 10) {
        return 'Phone number must be 10 digits';
      }
    }

    if (field.hasAttribute('data-validate-zip')) {
      if (value && !/^\d{5}$/.test(value)) {
        return 'Please enter a valid 5-digit ZIP code';
      }
    }

    if (field.hasAttribute('data-validate-name')) {
      if (value && value.length < 2) {
        return `${
          field.getAttribute('data-label') || 'Name'
        } must be at least 2 characters`;
      }
      if (value && !/^[a-zA-Z\s-']+$/.test(value)) {
        return 'Please enter a valid name';
      }
    }

    if (field.hasAttribute('data-validate-street')) {
      if (value && value.length < 5) {
        return `${
          field.getAttribute('data-label') || 'Street'
        } must be at least 5 characters`;
      }
      if (value && !/^[a-zA-Z0-9\s.,-]+$/.test(value)) {
        return 'Please enter a valid street address';
      }
    }

    if (field.hasAttribute('data-validate-city')) {
      if (value && value.length < 2) {
        return `${
          field.getAttribute('data-label') || 'City'
        } must be at least 2 characters`;
      }
      if (value && !/^[a-zA-Z\s-']+$/.test(value)) {
        return 'Please enter a valid city name';
      }
    }

    return null;
  }

  validateAll(): HTMLInputElement[] {
    const errorFields: HTMLInputElement[] = [];
    const fields = this.form.querySelectorAll(
      'input, select, textarea'
    ) as NodeListOf<HTMLInputElement>;

    fields.forEach((field) => {
      const error = this.validateField(field);
      if (error) {
        this.showError(field, error);
        errorFields.push(field);
      } else {
        this.removeError(field);
      }
    });

    return errorFields;
  }

  showError(field: HTMLInputElement, error: string): void {
    field.classList.add(this.options.errorInputClass || 'error-input');

    // Remove existing error message
    const existingError = field.parentElement?.querySelector(
      `.${this.options.errorMessageClass || 'error-message'}`
    );
    if (existingError) {
      existingError.remove();
    }

    // Create new error message
    const errorElement = document.createElement(
      this.options.errorMessageTag || 'span'
    );
    errorElement.className = this.options.errorMessageClass || 'error-message';
    errorElement.textContent = error;

    // Insert after the field
    field.parentElement?.insertBefore(errorElement, field.nextSibling);
  }

  removeError(field: HTMLInputElement): void {
    field.classList.remove(this.options.errorInputClass || 'error-input');

    // Remove error message
    const errorElement = field.parentElement?.querySelector(
      `.${this.options.errorMessageClass || 'error-message'}`
    );
    if (errorElement) {
      errorElement.remove();
    }
  }
}

export function useTreehouseValidator(
  formId: string,
  form: UseFormReturn<any>,
  options: TreehouseValidatorOptions = {}
) {
  const validatorRef = useRef<any>(null);

  useEffect(() => {
    // Load Treehouse Form Validator script
    const loadScript = () => {
      if (window.ThFormValidator) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          'https://cdn.treehouseinternetgroup.com/cms_core/assets/js/th_form_validator.js';
        script.onload = () => {
          // Wait a bit for the script to initialize
          setTimeout(() => resolve(), 100);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeValidator = async () => {
      try {
        await loadScript();

        // Wait for DOM to be ready
        if (document.getElementById(formId)) {
          const defaultOptions: TreehouseValidatorOptions = {
            disableSubmit: true,
            validateOnBlur: true,
            errorMessageClass: 'error-message',
            errorMessageTag: 'span',
            errorInputClass: 'error-input',
            ...options,
          };

          // Try to use Treehouse validator, fallback to our implementation
          if (
            window.ThFormValidator &&
            typeof window.ThFormValidator === 'function'
          ) {
            validatorRef.current = new window.ThFormValidator(
              formId,
              defaultOptions
            );
          } else {
            console.warn(
              'Treehouse Form Validator not available, using fallback validator'
            );
            validatorRef.current = new FallbackValidator(
              formId,
              defaultOptions
            );
          }
        }
      } catch (error) {
        console.error(
          'Failed to load Treehouse Form Validator, using fallback:',
          error
        );
        // Use fallback validator
        if (document.getElementById(formId)) {
          const defaultOptions: TreehouseValidatorOptions = {
            disableSubmit: true,
            validateOnBlur: true,
            errorMessageClass: 'error-message',
            errorMessageTag: 'span',
            errorInputClass: 'error-input',
            ...options,
          };
          validatorRef.current = new FallbackValidator(formId, defaultOptions);
        }
      }
    };

    initializeValidator();

    return () => {
      if (validatorRef.current) {
        // Clean up validator if needed
        validatorRef.current = null;
      }
    };
  }, [formId, options]);

  const validateField = (field: HTMLInputElement) => {
    if (validatorRef.current) {
      return validatorRef.current.validateField(field);
    }
    return null;
  };

  const validateAll = () => {
    if (validatorRef.current) {
      return validatorRef.current.validateAll();
    }
    return [];
  };

  const showError = (field: HTMLInputElement, error: string) => {
    if (validatorRef.current) {
      validatorRef.current.showError(field, error);
    }
  };

  const removeError = (field: HTMLInputElement) => {
    if (validatorRef.current) {
      validatorRef.current.removeError(field);
    }
  };

  return {
    validator: validatorRef.current,
    validateField,
    validateAll,
    showError,
    removeError,
  };
}
