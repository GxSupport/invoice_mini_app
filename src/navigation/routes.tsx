import type { ComponentType, JSX } from 'react';

import { HomePageContainer } from '@/pages/HomePage/HomePageContainer';
import { InitDataPage } from '@/pages/InitDataPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: HomePageContainer },
  { path: '/init-data', Component: InitDataPage, title: 'Init Data' },
  { path: '/login', Component: LoginPage, title: 'Login' },
];