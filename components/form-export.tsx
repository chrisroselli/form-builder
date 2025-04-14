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
import { z } from 'zod';

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

  const generateHtml = () => {
    if (
      filteredRows.length === 0 ||
      filteredRows.every((row) => row.elements.length === 0)
    )
      return '';

    let html = `<script src="https://www.google.com/recaptcha/api.js" async defer></script>  
  <div class="form-container">
  <form id="custom-form" action="/custom-confirmation.html" method="POST">`;

    filteredRows.forEach((row) => {
      if (row.elements.length === 0) return;

      html += `
    <div class="form-row">`;

      row.elements.forEach((element) => {
        const {
          id,
          type,
          label,
          placeholder,
          required,
          options,
          rows,
          columns,
        } = element;
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
            } ${required ? 'required' : ''}>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'tel':
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${required ? 'required' : ''}
            inputmode="numeric">
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'number':
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${required ? 'required' : ''}>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'date':
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${required ? 'required' : ''}>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'textarea':
            html += `
          <textarea id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } rows="${rows || 3}" ${required ? 'required' : ''}></textarea>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'select':
            html += `
          <select id="${inputId}" name="${inputName}" ${
              required ? 'required' : ''
            }>
            <option value="" disabled selected>${
              placeholder || 'Select an option'
            }</option>`;
            options?.forEach((option) => {
              html += `
            <option value="${option}">${option}</option>`;
            });
            html += `
          </select>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          case 'checkbox':
            html += `
          <div class="checkbox-wrapper">
            <input type="checkbox" id="${inputId}" name="${inputName}" ${
              required ? 'required' : ''
            }>
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
              <input type="radio" id="${inputId}-${index}" name="${inputId}" value="${option}" ${
                required ? 'required' : ''
              }>
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
          <input type="file" id="${inputId}" name="${inputName}" ${
              required ? 'required' : ''
            }>
          <div id="${inputName}Error" class="error-message"></div>`;
            break;
          default:
            html += `
          <input type="${type}" id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } ${required ? 'required' : ''}>
          <div id="${inputName}Error" class="error-message"></div>`;
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
    <div class="g-recaptcha" data-sitekey="${confirmationData.recaptchaSiteKey}"></div>`;

    if (confirmationData.enableSMS) {
      html += `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="sms-disclaimer" name="sms_disclaimer" required>
        <label for="sms-disclaimer">
          <Label htmlFor="sms-disclaimer" className="text-xs italic">
                  By checking this box, you agree to receive text messages from
                  Connecticut Basement Systems related to appointment setting,
                  service informational, and marketing messages at the phone
                  number provided above. You may reply STOP to opt-out at any
                  time. Reply HELP for assistance. Messages and data rates may
                  apply. Message frequency will vary. Learn more on our
                  <a href="/privacy-policy.html">Privacy Policy</a> page and
                  <a href="/terms-of-use.html">Terms &amp; Conditions</a>.
        </label>
        <div id="sms_disclaimerError" class="error-message"></div>
      </div>`;
    }

    html += `
      <button type="submit" class="submit-button">${confirmationData.submitButtonTitle}</button>
    </div>
  </form>
</div>`;

    return html;
  };

  const generateCss = () => {
    return `<style>
.form-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
  margin-bottom: 20px;
}

.form-col-1, .form-col-2, .form-col-3 {
  padding: 0 10px;
  width: 100%;
}

@media (min-width: 768px) {
  .form-col-2 {
    width: 50%;
  }

  .form-col-3 {
    width: 33.333%;
  }
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.2s ease;
}

input[type="text"].is-invalid,
input[type="email"].is-invalid,
input[type="tel"].is-invalid,
input[type="number"].is-invalid,
input[type="date"].is-invalid,
textarea.is-invalid,
select.is-invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

textarea {
  resize: vertical;
}

.checkbox-wrapper,
.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.required {
  color: #e53e3e;
  margin-left: 2px;
}

.submit-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #4338ca;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
}
</style>`;
  };

  const generateJavaScript = () => {
    if (
      filteredRows.length === 0 ||
      filteredRows.every((row) => row.elements.length === 0)
    )
      return '';

    let js = `<script type="module">
    import { z } from 'https://cdn.jsdelivr.net/npm/zod@3.22.4/+esm';

    const form = document.getElementById('custom-form');
    const errorElements = {};`;

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

    js += `
    
    // Define the schema
    const formSchema = z.object({`;

    // Generate schema fields
    filteredRows.forEach((row) => {
      if (row.elements.length === 0) return;

      row.elements.forEach((element) => {
        const { type, label, required } = element;
        const inputName = `form_logger_${label.replace(/ /g, '_')}`;

        switch (type) {
          case 'text':
            js += `
      '${inputName}': z.string()${
              required ? `.min(1, '${label} is required')` : ''
            }.min(2, '${label} must be at least 2 characters'),`;
            break;
          case 'email':
            js += `
      '${inputName}': z.string()${
              required ? `.min(1, 'Email is required')` : ''
            }.email('Please enter a valid email address'),`;
            break;
          case 'tel':
            js += `
      '${inputName}': z.string()${
              required ? `.min(1, 'Phone number is required')` : ''
            }.regex(/^\\(\\d{3}\\) \\d{3}-\\d{4}$/, 'Please enter a valid phone number in the format (xxx) xxx-xxxx'),`;
            break;
          case 'number':
            js += `
      '${inputName}': z.string()${
              required ? `.min(1, 'Number is required')` : ''
            }.regex(/^\\d+$/, 'Please enter a valid number'),`;
            break;
          case 'checkbox':
            js += `
      '${inputName}': z.boolean()${
              required
                ? `.refine(val => val === true, { message: '${label} is required' })`
                : ''
            },`;
            break;
          default:
            js += `
      '${inputName}': z.string()${
              required ? `.min(1, '${label} is required')` : ''
            },`;
        }
      });
    });

    js += `
    });

    function clearErrors() {
        Object.values(errorElements).forEach(el => {
            if (el) el.textContent = '';
        });
        // Clear validation states
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }

    function validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value;
        const fieldSchema = formSchema.shape[fieldName];
        
        if (!fieldSchema) return;
        
        const result = fieldSchema.safeParse(fieldValue);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        if (result.success) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (errorElement) errorElement.textContent = '';
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = result.error.errors[0].message;
        }
    }

    function displayErrors(errors) {
        clearErrors();
        errors.forEach(error => {
            const field = error.path[0];
            const inputField = document.querySelector(\`[name="\${field}"]\`);
            if (inputField) {
                inputField.classList.add('is-invalid');
            }
            if (errorElements[field]) {
                errorElements[field].textContent = error.message;
            }
        });
    }

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\D/g, '');
            value = value.replace(/^(\\d{0,3})(\\d{0,3})(\\d{0,4}).*/, '($1) $2-$3').trim();
            e.target.value = value;
            validateField(e.target);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        const result = formSchema.safeParse(formValues);
        
        if (result.success) {
            clearErrors();
            // Add success state to all fields
            document.querySelectorAll('input, select, textarea').forEach(field => {
                field.classList.add('is-valid');
            });
            form.submit();
        } else {
            displayErrors(result.error.errors);
        }
    });

    // Add input event listeners to validate fields in real-time
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            validateField(field);
        });
        
        field.addEventListener('blur', () => {
            validateField(field);
        });
    });
</script>`;

    return js;
  };

  const generateConfirmationCode = () => {
    return `<?php
$output = '<style>form{display:none;}</style>';
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
          $logger->setcustomEmailSubject('${confirmationData.customEmailSubject}');
          $logger->setNotificationEmailAddresses('${confirmationData.notificationEmailAddresses}');

		// Save the form and send notifications
	if ($logger->saveData($_POST)) {
			$output .= '<style>form{display:none;}</style>
			<h1>Thank you!</h1>
			<h3>We have received your information and will get back to you shortly.</h3>';
		} else {
			$output .= '<p>Please try your submission again or contact us for assistance.</p>';
		}
	} else {
         // reCAPTCHA Verification failed
		$output .= '<p>There was a problem verifying your submission with reCAPTCHA.</p>';
	}
} else {
    // Missing POST data
	$output .= '<h1>Looks like you forgot something!</h1><p>Please fill out the registration form completely.</p>';
}
echo $output;
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
