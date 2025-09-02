import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
import { loginUser } from '@/api/auth.js';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      loginMutation.mutate(formData);
    }
  };

  const handleInputChange = (field) => (value) => {
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
                disabled={loginMutation.isPending}
              />
            </Cell>
            <Cell>
              <Input
                header="Parol"
                placeholder="Parolingizni kiriting"
                value={formData.password}
                onChange={handleInputChange('password')}
                type="password"
                disabled={loginMutation.isPending}
              />
            </Cell>
            <Cell>
              <Button
                size="l"
                stretched
                loading={loginMutation.isPending}
                onClick={handleSubmit}
                disabled={!formData.email || !formData.password}
              >
                {loginMutation.isPending ? 'Kirish...' : 'Kirish'}
              </Button>
            </Cell>
          </form>
          
          {loginMutation.isError && (
            <Cell>
              <Banner
                header="Xatolik"
                type="error"
              >
                {loginMutation.error?.message || 'Kirish jarayonida xatolik yuz berdi'}
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