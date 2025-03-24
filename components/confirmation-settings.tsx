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
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setConfirmationData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmation Settings</CardTitle>
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
  );
}
