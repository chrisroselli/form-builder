'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { Separator } from './ui/separator';

interface ConfirmationSettingsProps {
  confirmationData: {
    recaptchaSiteKey: string;
    recaptchaSecretKey: string;
    formName: string;
    customEmailSubject: string;
    notificationEmailAddresses: string;
    submitButtonTitle: string;
    enableSMS: boolean;
    confirmationH1Text: string;
    confirmationPText: string;
    primaryColor: string;
    secondaryColor: string;
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

  useEffect(() => {
    // Update CSS variables when colors change
    document.documentElement.style.setProperty(
      '--form-primary-color',
      confirmationData.primaryColor || '#000000'
    );
    document.documentElement.style.setProperty(
      '--form-secondary-color',
      confirmationData.secondaryColor || '#000000'
    );
  }, [confirmationData.primaryColor, confirmationData.secondaryColor]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Form Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Color Fields */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={confirmationData.primaryColor || '#000000'}
                    onChange={handleChange}
                    className="h-10 w-10 p-1"
                  />
                  <Input
                    type="text"
                    value={confirmationData.primaryColor || '#000000'}
                    onChange={(e) => {
                      setConfirmationData((prev: any) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }));
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    value={confirmationData.secondaryColor || '#000000'}
                    onChange={handleChange}
                    className="h-10 w-10 p-1"
                  />
                  <Input
                    type="text"
                    value={confirmationData.secondaryColor || '#000000'}
                    onChange={(e) => {
                      setConfirmationData((prev: any) => ({
                        ...prev,
                        secondaryColor: e.target.value,
                      }));
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            {/* SMS and Submit Button Fields */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col">
                <div className="space-y-2">
                  <Label htmlFor="submitButtonTitle">Submit Button Title</Label>
                  <div className="mt-2">
                    <Input
                      id="submitButtonTitle"
                      name="submitButtonTitle"
                      type="text"
                      value={confirmationData.submitButtonTitle}
                      onChange={handleChange}
                      placeholder="Submit"
                    />
                  </div>
                </div>
              </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Page Settings and reCAPTCHA Settings side by side */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Confirmation Page Settings
            </CardTitle>
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
                Notification Email Address
              </Label>
              <Input
                id="notificationEmailAddresses"
                name="notificationEmailAddresses"
                type="text"
                value={confirmationData.notificationEmailAddresses}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmationH1Text">
                Confirmation Page H1 Text
              </Label>
              <Input
                id="confirmationH1Text"
                name="confirmationH1Text"
                type="text"
                value={confirmationData.confirmationH1Text}
                onChange={handleChange}
                placeholder="Thank you!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmationPText">
                Confirmation Page P Text
              </Label>
              <Input
                id="confirmationPText"
                name="confirmationPText"
                type="text"
                value={confirmationData.confirmationPText}
                onChange={handleChange}
                placeholder="We have received your information and will get back to you shortly."
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">reCAPTCHA Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recaptchaSiteKey">Site Key</Label>
              <Input
                id="recaptchaSiteKey"
                name="recaptchaSiteKey"
                type="text"
                value={confirmationData.recaptchaSiteKey}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recaptchaSecretKey">Secret Key</Label>
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
      </div>
    </>
  );
}
