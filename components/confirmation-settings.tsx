'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { FormEvent } from 'react';

interface ConfirmationSettingsProps {
  confirmationData: {
    recaptchaSiteKey: string;
    recaptchaSecretKey: string;
    formName: string;
    customEmailSubject: string;
    notificationEmailAddresses: string;
    submitButtonTitle: string;
    enableSMS: boolean;
  };
  setConfirmationData: (data: any) => void;
}

export default function ConfirmationSettings({
  confirmationData,
  setConfirmationData,
}: ConfirmationSettingsProps) {
  const handleChange = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setConfirmationData((prevData: any) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Form Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="enableSMS">Enable SMS Disclaimer</Label>
              <input
                type="checkbox"
                id="enableSMS"
                name="enableSMS"
                checked={confirmationData.enableSMS}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="submitButtonTitle">Submit Button Title</Label>
            <Input
              id="submitButtonTitle"
              name="submitButtonTitle"
              type="text"
              value={confirmationData.submitButtonTitle}
              onChange={handleChange}
              placeholder="Submit"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Confirmation Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              name="formName"
              type="text"
              value={confirmationData.formName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customEmailSubject">Custom Email Subject</Label>
            <Input
              id="customEmailSubject"
              name="customEmailSubject"
              type="text"
              value={confirmationData.customEmailSubject}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notificationEmailAddresses">
              Notification Email Addresses
            </Label>
            <Textarea
              id="notificationEmailAddresses"
              name="notificationEmailAddresses"
              value={confirmationData.notificationEmailAddresses}
              onChange={handleChange}
              placeholder="Separate addresses with commas"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>reCAPTCHA Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recaptchaSiteKey">reCAPTCHA Site Key</Label>
            <Input
              id="recaptchaSiteKey"
              name="recaptchaSiteKey"
              type="text"
              value={confirmationData.recaptchaSiteKey}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recaptchaSecretKey">reCAPTCHA Secret Key</Label>
            <Input
              id="recaptchaSecretKey"
              name="recaptchaSecretKey"
              type="text"
              value={confirmationData.recaptchaSecretKey}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
