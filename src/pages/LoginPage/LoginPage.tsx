import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Section,
  Cell,
  List,
  Input,
  Button,
  Placeholder,
  Banner
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types/auth';

export function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);
      await setAuth(data);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kirish jarayonida xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Page>
      <List>
        <Section header="Tizimga kirish">
          <form onSubmit={handleSubmit}>
            <Cell>
              <Input
                header="Email"
                placeholder="Emailingizni kiriting"
                value={formData.email}
                onChange={handleInputChange('email')}
                type="email"
                disabled={isLoading}
              />
            </Cell>
            <Cell>
              <Input
                header="Parol"
                placeholder="Parolingizni kiriting"
                value={formData.password}
                onChange={handleInputChange('password')}
                type="password"
                disabled={isLoading}
              />
            </Cell>
            <Cell>
              <Button
                size="l"
                stretched
                loading={isLoading}
                onClick={handleSubmit}
                disabled={!formData.email || !formData.password}
              >
                {isLoading ? 'Kirish...' : 'Kirish'}
              </Button>
            </Cell>
          </form>
          
          {error && (
            <Cell>
              <Banner
                header="Xatolik"
                type="error"
              >
                {error}
              </Banner>
            </Cell>
          )}
          
          {!formData.email && !formData.password && (
            <Placeholder
              description="Email va parolingizni kiriting"
            >
              Tizimga kirish uchun
            </Placeholder>
          )}
        </Section>
      </List>
    </Page>
  );
}