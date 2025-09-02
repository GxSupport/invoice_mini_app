import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Section,
  Cell,
  List,
  Input,
  Button,
  Placeholder,
  Banner,
  Text,
  Image,
  Divider
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { formatPhoneNumber, cleanPhoneNumber, getPhoneNumberError } from '@/utils/phoneNumber';
import type { LoginCredentials } from '@/types/auth';

import invoiceSvg from '@/assets/invoice.svg';

export function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({
    phoneNumber: '',
    password: ''
  });
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    phoneNumber?: string;
    password?: string;
  }>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    
    const phoneError = getPhoneNumberError(formData.phoneNumber);
    if (phoneError) {
      errors.phoneNumber = phoneError;
    }
    
    if (!formData.password.trim()) {
      errors.password = "Parol kiritilishi shart";
    } else if (formData.password.length < 6) {
      errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clean phone number for API
      const loginData = {
        ...formData,
        phoneNumber: cleanPhoneNumber(formData.phoneNumber)
      };
      
      const data = await loginUser(loginData);
      await setAuth(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kirish jarayonida xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setDisplayPhoneNumber(formatted);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
    
    // Clear phone number error on change
    if (fieldErrors.phoneNumber) {
      setFieldErrors(prev => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    
    // Clear password error on change
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const isFormValid = formData.phoneNumber && formData.password && Object.keys(fieldErrors).length === 0;

  return (
    <Page back={false}>
      <List>
        <Section 
          header="Kirish"
          footer="Sizning Telegram akkountingiz e-invoice.uz hisobingiz bilan bog'lanadi"
        >
          {/* App Icon/Logo */}
          <Cell>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
              <Image 
                src={invoiceSvg}
                style={{ 
                  width: '120px',
                  height: 'auto',
                  marginBottom: '16px'
                }}
              />
              <Text weight="2" style={{ fontSize: '20px', marginBottom: '8px' }}>
                e-invoice.uz
              </Text>
              <Text style={{ 
                color: 'var(--tg-theme-hint-color)', 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                e-invoice.uz dagi login va parolingiz bilan kiring va foydalanishni davom ettiring
              </Text>
            </div>
          </Cell>

          <Divider />

          <form onSubmit={handleSubmit}>
            {/* Phone Number Input */}
            <Cell>
              <Input
                header="Telefon raqami"
                placeholder="+998 90 123 45 67"
                value={displayPhoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                type="tel"
                disabled={isLoading}
                status={fieldErrors.phoneNumber ? 'error' : undefined}
              />
              {fieldErrors.phoneNumber && (
                <Text style={{ 
                  color: 'var(--tg-theme-destructive-text-color)', 
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {fieldErrors.phoneNumber}
                </Text>
              )}
            </Cell>

            {/* Password Input */}
            <Cell>
              <Input
                header="Parol"
                placeholder="Parolingizni kiriting"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                type="password"
                disabled={isLoading}
                status={fieldErrors.password ? 'error' : undefined}
              />
              {fieldErrors.password && (
                <Text style={{ 
                  color: 'var(--tg-theme-destructive-text-color)', 
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {fieldErrors.password}
                </Text>
              )}
            </Cell>

            {/* Submit Button */}
            <Cell>
              <Button
                size="l"
                stretched
                loading={isLoading}
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
                style={{ marginTop: '8px' }}
              >
                {isLoading ? 'Kirish...' : 'Kirish'}
              </Button>
            </Cell>
          </form>

          {/* Error Banner */}
          {error && (
            <Cell>
              <Banner
                header="Xatolik"
              >
                {error}
              </Banner>
            </Cell>
          )}
        </Section>

        {/* Telegram Connection Info */}
        <Section
          header="Telegram bog'lanishi"
          footer="Muvaffaqiyatli kirish orqali sizning Telegram akkountingiz e-invoice.uz hisobingiz bilan xavfsiz bog'lanadi"
        >
          <Cell
            subtitle="Sizning Telegram ma'lumotlaringiz qo'shimcha xavfsizlik uchun ishlatiladi"
          >
            <Text style={{ color: 'var(--tg-theme-hint-color)' }}>
              Akkaunt bog'lanishi
            </Text>
          </Cell>
        </Section>

        {/* Help Section */}
        <Section
          header="Yordam"
          footer="Agar hisobingiz bo'lmasa yoki parolingizni unutgan bo'lsangiz, administrator bilan bog'laning"
        >
          <Cell 
            subtitle="Parolingizni unutgan bo'lsangiz?"
            onClick={() => {
              // TODO: Implement forgot password flow
              alert('Parolni tiklash funksiyasi tez orada qoshiladi');
            }}
            interactiveAnimation="opacity"
          >
            <Text style={{ color: 'var(--tg-theme-link-color)' }}>
              Parolni tiklash
            </Text>
          </Cell>
        </Section>

        {/* Empty State */}
        {!formData.phoneNumber && !formData.password && !error && (
          <Placeholder
            description="Ma'lumotlaringizni kiriting va 'Kirish' tugmasini bosing"
          >
            Tizimga kirish uchun
          </Placeholder>
        )}
      </List>
    </Page>
  );
}