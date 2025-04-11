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
            } ${required ? 'required' : ''}>`;
            break;
          case 'email':
            break;
          case 'tel':
            break;
          case 'number':
            break;
          case 'date':
            break;
          case 'textarea':
            html += `
          <textarea id="${inputId}" name="${inputName}" ${
              placeholder ? `placeholder="${placeholder}"` : ''
            } rows="${rows || 3}" ${required ? 'required' : ''}></textarea>`;
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
          </select>`;
            break;
          case 'checkbox':
            html += `
          <div class="checkbox-wrapper">
            <input type="checkbox" id="${inputId}" name="${inputName}" ${
              required ? 'required' : ''
            }>
            ${label ? `<label for="${inputId}">${label}</label>` : ''}
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
          </div>`;
            break;
          case 'file':
            html += `
          <input type="file" id="${inputId}" name="${inputName}" ${
              required ? 'required' : ''
            }>`;
            break;
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
    color: red;
    font-size: 14px;
    margin-top: 5px;
}
/* Success state styling */
.is-valid {
    border-color: #4CAF50 !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234CAF50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 20px;
}
/* Error state styling */
.is-invalid {
    border-color: #f44336 !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f44336' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 20px;
}
</style>`;
  };

  const generateJavaScript = () => {
    if (
      filteredRows.length === 0 ||
      filteredRows.every((row) => row.elements.length === 0)
    )
      return '';

    let js = `<script src="https://unpkg.com/just-validate@latest/dist/just-validate.production.min.js"></script>
<script>
    // Phone number formatting with regex
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/, '($1) $2-$3').trim();
        e.target.value = value;
    });

    const validation = new window.JustValidate('#contactForm', {
        validateBeforeSubmitting: true,
        errorFieldCssClass: 'is-invalid',
        successFieldCssClass: 'is-valid',
        errorLabelCssClass: 'error-message',
    });
validation
`;

    filteredRows.forEach((row) => {
      if (row.elements.length === 0) return;

      row.elements.forEach((element) => {
        const { type, label, placeholder } = element;
        const inputId = label.toLowerCase().replace(/ /g, '-');
        switch (type) {
          case 'text':
            js += `.addField('#${inputId}', [
        {
            rule: 'required',
            errorMessage: '${label} is required',
        },
        {
            rule: 'minLength',
            value: 2,
            errorMessage: '${label} must be at least 2 characters',
        },
        {
            rule: 'customRegexp',
            value: /^[a-zA-Z\s]*$/,
            errorMessage: '${label} cannot contain numbers',
        }
  ])
  `;
            break;
          case 'email':
            break;
          case 'tel':
            break;
          case 'number':
            break;
          case 'date':
            break;
          case 'textarea':
            js += ``;
            break;
          case 'select':
            break;
          case 'file':
            break;
        }
      });
    });

    js += `
});
  .onSuccess((event) => {
    console.log('Form submitted successfully!');
    // You can add your form submission logic here
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
