'use client';

import { useState } from 'react';
import type { FormRow } from '@/lib/types';
import type { ConfirmationData } from './form-builder';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FormExportProps {
  formRows: FormRow[];
  confirmationData: ConfirmationData;
}
let addFields = 'test';
export default function FormExport({
  formRows,
  confirmationData,
}: FormExportProps) {
  const [copied, setCopied] = useState(false);

  // Filter out placeholder elements for the export
  const filteredRows = formRows.map((row) => ({
    ...row,
    elements: row.elements.filter((el) => !el.isPlaceholder),
  }));

  // Helper function to generate Treehouse Form Validator data attributes
  const getValidationAttributes = (element: any) => {
    const attrs: string[] = [];

    if (element.required) {
      attrs.push('data-validate-required');
    }

    if (element.validation?.type) {
      switch (element.validation.type) {
        case 'name':
          attrs.push('data-validate-name');
          attrs.push(`data-label="${element.label}"`);
          break;
        case 'street':
          attrs.push('data-validate-street');
          attrs.push(`data-label="${element.label}"`);
          break;
        case 'city':
          attrs.push('data-validate-city');
          attrs.push(`data-label="${element.label}"`);
          break;
        case 'zip':
          attrs.push('data-validate-zip="us"');
          attrs.push(`data-label="${element.label}"`);
          break;
        case 'custom':
          if (element.validation.pattern) {
            attrs.push(`pattern="${element.validation.pattern}"`);
            attrs.push(
              `title="${element.validation.patternMessage || 'Invalid format'}"`
            );
          }
          break;
      }
    } else {
      switch (element.type) {
        case 'email':
          attrs.push('data-validate-email');
          break;
        case 'tel':
          attrs.push('data-validate-phone="us"');
          break;
      }
    }

    return attrs.join(' ');
  };

  const generateHtml = () => {
    if (
      filteredRows.length === 0 ||
      filteredRows.every((row) => row.elements.length === 0)
    )
      return '';

    let html = `<div class="form-container">
  <form id="custom-form" action="/custom-confirmation.html" method="POST">`;

    filteredRows.forEach((row) => {
      if (row.elements.length === 0) return;

      html += `
    <div class="form-row">`;

      row.elements.forEach((element) => {
        const { type, label, placeholder, required, options, rows, columns } =
          element;
        const inputId = label.toLowerCase().replace(/ /g, '-');
        const inputName = `form_logger_${label.replace(/ /g, '_')}`;
        const columnClass = columns ? `form-col-${columns}` : 'form-col-1';

        html += `
      <div class="${columnClass}">
        <div class="form-group">`;

        if (type !== 'checkbox') {
          html += `
          ${
            label
              ? `<label for="${inputId}">${label}${
                  required ? '<span class="required">*</span>' : ''
                }</label>`
              : ''
          }`;
        }
        switch (type) {
          case 'text':
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${
              element.validation?.type === 'zip'
                ? `inputmode="numeric" maxLength="5"`
                : ''
            } ${getValidationAttributes(
              element
            )}><div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'tel':
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            }
            inputmode="numeric" maxLength="10" ${getValidationAttributes(
              element
            )}><div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'date':
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${getValidationAttributes(
              element
            )}><div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'textarea':
            html += `
          <textarea id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } rows="${rows || 3}" ${getValidationAttributes(
              element
            )}></textarea><div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'select':
            html += `
          <select id="${inputId}" name="${inputName}" ${getValidationAttributes(
              element
            )}>
            <option value="" disabled selected>${
              placeholder || 'Select an option'
            }</option>`;
            options?.forEach((option) => {
              html += `
            <option value="${option}">${option}</option>`;
            });
            html += `
          </select><div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'checkbox':
            html += `
          <div class="checkbox-wrapper">
            <input type="checkbox" id="${inputId}" name="${inputName}" ${getValidationAttributes(
              element
            )}>
            ${label ? `<label for="${inputId}">${label}</label>` : ''}
            <div id="${inputName}Error" class="error-message"></div>
          </div>`;
            break;
          case 'radio':
            html += `
          <div class="radio-group">`;
            options?.forEach((option, index) => {
              html += `
            <div class="radio-wrapper">
              <input type="radio" id="${inputId}-${index}" name="${inputId}" value="${option}" ${getValidationAttributes(
                element
              )}>
              ${
                label
                  ? `<label for="${inputId}-${index}">${option}</label>`
                  : ''
              }
            </div>`;
            });
            html += `
            <div id="${inputId}Error" class="error-message"></div>
          </div>`;
            break;
          case 'file':
            html += `
          <input type="file" id="${inputId}" name="${inputName}" ${getValidationAttributes(
              element
            )}>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          default:
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${getValidationAttributes(
              element
            )}><div id="${inputName}Error" class="error-message"></div>`;
        }

        html += `
        </div>
      </div>`;
      });
      html += `
    </div>`;
    });

    html += `
    <div class="form-group">
    <div class="g-recaptcha" data-sitekey="${confirmationData.recaptchaSiteKey}" data-callback="onRecaptchaSuccess"></div>
    <div id="recaptchaError" class="error-message"></div>`;

    if (confirmationData.enableSMS) {
      html += `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="sms-disclaimer" name="sms_disclaimer">
        <label for="sms-disclaimer">
          <Label htmlFor="sms-disclaimer" className="text-xs italic">
                  By checking this box, you agree to receive text messages from
                  [company] related to appointment setting, service informational,
                  and marketing messages at the phone number provided above. You
                  may reply STOP to opt-out at any time. Reply HELP for
                  assistance. Messages and data rates may apply. Message
                  frequency will vary. Learn more on our
                  <a href="/privacy-policy.html">Privacy Policy</a> page and
                  <a href="/terms-of-use.html">Terms &amp; Conditions</a>.
        </label>
        <div id="sms_disclaimerError" class="error-message"></div>
      </div>`;
    }

    html += `
      <button type="submit" class="submit-button">${
        confirmationData.submitButtonTitle || 'Submit'
      }</button>
    </div>
  </form>
</div>`;

    return html;
  };

  const generateCss = () => {
    const primaryColor = confirmationData.primaryColor;
    const secondaryColor = confirmationData.secondaryColor;

    return `<style>
:root {
  --form-primary-color: ${primaryColor};
  --form-secondary-color: ${secondaryColor};
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.form-col-1 {
  flex: 0 0 100%;
  padding: 0 10px;
}

.form-col-2 {
  flex: 0 0 50%;
  padding: 0 10px;
}

.form-col-3 {
  flex: 0 0 33.333%;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .form-col-2,
  .form-col-3 {
    flex: 0 0 100%;
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--form-primary-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--form-secondary-color);
}

.form-group input.error-input,
.form-group select.error-input,
.form-group textarea.error-input {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.form-group input.is-valid,
.form-group select.is-valid,
.form-group textarea.is-valid {
  border-color: #28a745;
  background-color: #f8fff9;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.required {
  color: #dc3545;
}

.checkbox-wrapper,
.radio-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-wrapper input[type="checkbox"],
.radio-wrapper input[type="radio"] {
  width: auto;
  margin-right: 8px;
}

.radio-group {
  flex-direction: column;
  align-items: flex-start;
}

.radio-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.submit-button, button[type="submit"] {
  width: 100%;
  padding: 15px;
  background-color: var(--form-secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover, button[type="submit"]:hover {
  background-color: color-mix(in srgb, var(--form-secondary-color) 80%, transparent);
}

/* Error state styles */
.error-input {
  border-color: #dc3545 !important;
  background-color: #fff5f5 !important;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

/* Success state styles */
.is-valid {
  border-color: #28a745 !important;
  background-color: #f8fff9 !important;
}

/* Invalid state styles */
.is-invalid {
  border-color: #dc3545 !important;
  background-color: #fff5f5 !important;
}
</style>`;
  };

  const generateJavaScript = () => {
    if (
      filteredRows.length === 0 ||
      filteredRows.every((row) => row.elements.length === 0)
    )
      return '';

    let js = `<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script src="https://cdn.treehouseinternetgroup.com/cms_core/assets/js/th_form_validator.js"></script>
<script>
const form = document.getElementById('custom-form');
const errorElements = {};

// Fallback validator class when Treehouse script fails to load
class FallbackValidator {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = options;
    this.customValidators = options.customValidators || {};
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const dataValidate = field.getAttribute('data-validate-name') || 
                        field.getAttribute('data-validate-email') || 
                        field.getAttribute('data-validate-phone') ||
                        field.getAttribute('data-validate-zip') ||
                        field.getAttribute('data-validate-street') ||
                        field.getAttribute('data-validate-city');

    // Check required
    if (field.hasAttribute('data-validate-required') && !value) {
      return field.getAttribute('data-label') + ' is required';
    }

    // Check custom validators
    if (dataValidate && this.customValidators[dataValidate]) {
      const error = this.customValidators[dataValidate](field);
      if (error) return error;
    }

    // Built-in validators
    if (field.hasAttribute('data-validate-email')) {
      if (value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.hasAttribute('data-validate-phone')) {
      const phoneDigits = value.replace(/\\D/g, '');
      if (value && phoneDigits.length !== 10) {
        return 'Phone number must be 10 digits';
      }
    }

    if (field.hasAttribute('data-validate-zip')) {
      if (value && !/^\\d{5}$/.test(value)) {
        return 'Please enter a valid 5-digit ZIP code';
      }
    }

    if (field.hasAttribute('data-validate-name')) {
      if (value && value.length < 2) {
        return (field.getAttribute('data-label') || 'Name') + ' must be at least 2 characters';
      }
      if (value && !/^[a-zA-Z\\s-']+$/.test(value)) {
        return 'Please enter a valid name';
      }
    }

    if (field.hasAttribute('data-validate-street')) {
      if (value && value.length < 5) {
        return (field.getAttribute('data-label') || 'Street') + ' must be at least 5 characters';
      }
      if (value && !/^[a-zA-Z0-9\\s.,-]+$/.test(value)) {
        return 'Please enter a valid street address';
      }
    }

    if (field.hasAttribute('data-validate-city')) {
      if (value && value.length < 2) {
        return (field.getAttribute('data-label') || 'City') + ' must be at least 2 characters';
      }
      if (value && !/^[a-zA-Z\\s-']+$/.test(value)) {
        return 'Please enter a valid city name';
      }
    }

    return null;
  }

  validateAll() {
    const errorFields = [];
    const fields = this.form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
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

  showError(field, error) {
    field.classList.add(this.options.errorInputClass || 'error-input');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.' + (this.options.errorMessageClass || 'error-message'));
    if (existingError) {
      existingError.remove();
    }

    // Create new error message
    const errorElement = document.createElement(this.options.errorMessageTag || 'span');
    errorElement.className = this.options.errorMessageClass || 'error-message';
    errorElement.textContent = error;
    
    // Insert after the field
    field.parentElement.insertBefore(errorElement, field.nextSibling);
  }

  removeError(field) {
    field.classList.remove(this.options.errorInputClass || 'error-input');
    
    // Remove error message
    const errorElement = field.parentElement.querySelector('.' + (this.options.errorMessageClass || 'error-message'));
    if (errorElement) {
      errorElement.remove();
    }
  }
}`;

    // Generate error element references
    filteredRows.forEach((row) => {
      if (row.elements.length === 0) return;

      row.elements.forEach((element) => {
        const { label } = element;
        const inputName = `form_logger_${label.replace(/ /g, '_')}`;
        js += `
errorElements['${inputName}'] = document.getElementById('${inputName}Error');`;
      });
    });
    // Add error element reference for sms_disclaimer if enabled
    if (confirmationData.enableSMS) {
      js += `
errorElements['sms_disclaimer'] = document.getElementById('sms_disclaimerError');`;
    }

    // Add error element reference for reCAPTCHA
    js += `
errorElements['g-recaptcha-response'] = document.getElementById('recaptchaError');`;

    js += `

// Initialize validator (Treehouse or fallback)
let validator;
try {
    if (typeof ThFormValidator === 'function') {
        validator = new ThFormValidator('custom-form', {
            disableSubmit: true,
            validateOnBlur: true,
            errorMessageClass: 'error-message',
            errorMessageTag: 'span',
            errorInputClass: 'error-input',
            customValidators: {
                name: function(field) {
                    const value = field.value.trim();
                    if (!value) return field.getAttribute('data-label') + ' is required';
                    if (value.length < 2) return field.getAttribute('data-label') + ' must be at least 2 characters';
                    if (!/^[a-zA-Z\\s-']+$/.test(value)) return 'Please enter a valid name';
                },
                street: function(field) {
                    const value = field.value.trim();
                    if (!value) return field.getAttribute('data-label') + ' is required';
                    if (value.length < 5) return field.getAttribute('data-label') + ' must be at least 5 characters';
                    if (!/^[a-zA-Z0-9\\s.,-]+$/.test(value)) return 'Please enter a valid street address';
                },
                city: function(field) {
                    const value = field.value.trim();
                    if (!value) return field.getAttribute('data-label') + ' is required';
                    if (value.length < 2) return field.getAttribute('data-label') + ' must be at least 2 characters';
                    if (!/^[a-zA-Z\\s-']+$/.test(value)) return 'Please enter a valid city name';
                },
                email: function(field) {
                    const value = field.value.trim();
                    if (!value) return 'Email is required';
                    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                    if (!emailRegex.test(value)) return 'Please enter a valid email address';
                },
                phone: function(field) {
                    const value = field.value.replace(/\\D/g, '');
                    if (!value) return 'Phone number is required';
                    if (value.length !== 10) return 'Phone number must be 10 digits';
                }
            }
        });
    } else {
        throw new Error('ThFormValidator not available');
    }
} catch (error) {
    console.warn('Using fallback validator:', error);
    validator = new FallbackValidator('custom-form', {
        disableSubmit: true,
        validateOnBlur: true,
        errorMessageClass: 'error-message',
        errorMessageTag: 'span',
        errorInputClass: 'error-input',
        customValidators: {
            name: function(field) {
                const value = field.value.trim();
                if (!value) return field.getAttribute('data-label') + ' is required';
                if (value.length < 2) return field.getAttribute('data-label') + ' must be at least 2 characters';
                if (!/^[a-zA-Z\\s-']+$/.test(value)) return 'Please enter a valid name';
            },
            street: function(field) {
                const value = field.value.trim();
                if (!value) return field.getAttribute('data-label') + ' is required';
                if (value.length < 5) return field.getAttribute('data-label') + ' must be at least 5 characters';
                if (!/^[a-zA-Z0-9\\s.,-]+$/.test(value)) return 'Please enter a valid street address';
            },
            city: function(field) {
                const value = field.value.trim();
                if (!value) return field.getAttribute('data-label') + ' is required';
                if (value.length < 2) return field.getAttribute('data-label') + ' must be at least 2 characters';
                if (!/^[a-zA-Z\\s-']+$/.test(value)) return 'Please enter a valid city name';
            },
            email: function(field) {
                const value = field.value.trim();
                if (!value) return 'Email is required';
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
            },
            phone: function(field) {
                const value = field.value.replace(/\\D/g, '');
                if (!value) return 'Phone number is required';
                if (value.length !== 10) return 'Phone number must be 10 digits';
            }
        }
    });
}

// Add callback for reCAPTCHA
window.onRecaptchaSuccess = function() {
    // Clear reCAPTCHA error message when checkbox is checked
    const recaptchaError = document.getElementById('recaptchaError');
    if (recaptchaError) {
        recaptchaError.textContent = '';
    }
};

function clearErrors() {
    Object.values(errorElements).forEach(el => {
        if (el) el.textContent = '';
    });
    // Clear validation states
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get reCAPTCHA response
    const recaptchaResponse = grecaptcha.getResponse();
    
    // Validate reCAPTCHA
    if (!recaptchaResponse) {
        const recaptchaError = document.getElementById('recaptchaError');
        if (recaptchaError) {
            recaptchaError.textContent = 'Please complete the reCAPTCHA verification';
        }
        return;
    }
    
    // Validate form using validator
    const errorFields = validator.validateAll();
    if (errorFields.length > 0) {
        // Focus on first error field
        errorFields[0].focus();
        errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // If no errors, submit the form
    clearErrors();
    // Add success state to all fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.classList.add('is-valid');
    });
    form.submit();
});

// Add input event listeners to validate fields in real-time
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
        const error = validator.validateField(field);
        if (error) {
            validator.showError(field, error);
        } else {
            validator.removeError(field);
        }
    });
    
    field.addEventListener('blur', () => {
        const error = validator.validateField(field);
        if (error) {
            validator.showError(field, error);
        } else {
            validator.removeError(field);
        }
    });
});
</script>`;

    return js;
  };

  const generateConfirmationCode = () => {
    return `<?php
if(!empty($_POST)) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, [
		'secret' => '${confirmationData.recaptchaSecretKey}',
		'response' => $_POST['g-recaptcha-response'],
		'remoteip' => $_SERVER['REMOTE_ADDR']
	]);

	$resp = json_decode(curl_exec($ch));
	curl_close($ch);

	if ($resp->success) {
          global $siteData, $siteDefineData;
          require_once ENV_ROOT.'/portal/libraries/formLogger.api.php';
          $logger = new formLoggerApi();
          $logger->setSiteId($siteData['site.id']);
          $logger->setSessionId($siteDefineData['cms_tracking_sessions']['session.id']);
          $logger->setFormId('form_logger_');
          $logger->setFormName('${confirmationData.formName}');
          $logger->setcustomEmailSubject('${
            confirmationData.customEmailSubject
          }');
          $logger->setNotificationEmailAddresses('${
            confirmationData.notificationEmailAddresses
          }');

		// Save the form and send notifications
	if ($logger->saveData($_POST)) {
			$output .= '<style>form{display:none;}</style>
			<h1>${confirmationData.confirmationH1Text || 'Thank you!'}</h1>
			<p>${
        confirmationData.confirmationPText ||
        'We have received your information and will get back to you shortly.'
      }</p>';
		} else {
			$output .= '<p>Please try your submission again or contact us for assistance.</p>';
		}
	} else {
         // reCAPTCHA Verification failed
		$output .= '<p>There was a problem verifying your submission with reCAPTCHA.</p>';
	}
} else {
    // Missing POST data
	$output .= '<h1>Looks like you forgot to fill out a form field.</h1><p>Please fill out the form completely.</p>';
}
?>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Form</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredRows.length === 0 ||
        filteredRows.every((row) => row.elements.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Your form is empty. Add rows and elements to export.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="html">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="html" className="flex-1">
                HTML
              </TabsTrigger>
              <TabsTrigger value="css" className="flex-1">
                CSS
              </TabsTrigger>
              <TabsTrigger value="javascript" className="flex-1">
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="confirmation" className="flex-1">
                Confirmation Page
              </TabsTrigger>
            </TabsList>

            <TabsContent value="html">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-6 bg-primary text-white border-none hover:bg-primary-light"
                  onClick={() => copyToClipboard(generateHtml())}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <SyntaxHighlighter
                  language="html"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    maxHeight: '400px',
                    fontSize: '0.75rem',
                  }}
                >
                  {generateHtml()}
                </SyntaxHighlighter>
              </div>
            </TabsContent>

            <TabsContent value="css">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-6 bg-primary text-white border-none hover:bg-primary-light"
                  onClick={() => copyToClipboard(generateCss())}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <SyntaxHighlighter
                  language="html"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    maxHeight: '400px',
                    fontSize: '0.75rem',
                  }}
                >
                  {generateCss()}
                </SyntaxHighlighter>
              </div>
            </TabsContent>

            <TabsContent value="javascript">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-6 bg-primary text-white border-none hover:bg-primary-light"
                  onClick={() => copyToClipboard(generateJavaScript())}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <SyntaxHighlighter
                  language="html"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    maxHeight: '400px',
                    fontSize: '0.75rem',
                  }}
                >
                  {generateJavaScript()}
                </SyntaxHighlighter>
              </div>
            </TabsContent>

            <TabsContent value="confirmation">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-6 bg-primary text-white border-none hover:bg-primary-light"
                  onClick={() => copyToClipboard(generateConfirmationCode())}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <SyntaxHighlighter
                  language="php"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    maxHeight: '400px',
                    fontSize: '0.75rem',
                  }}
                >
                  {generateConfirmationCode()}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
