import type { ComponentType, JSX } from 'react';

import { HomePageContainer } from '@/pages/HomePage/HomePageContainer';
import { InitDataPage } from '@/pages/InitDataPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { ActListContainer } from '@/pages/ActList';
import { ActDetailsContainer } from '@/pages/ActDetails';
import { ProductListPage } from '@/pages/ActDetails/ProductListPage';

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
  { path: '/act', Component: ActListContainer, title: 'Act' },
  { path: '/act/:actId', Component: ActDetailsContainer, title: 'Act Details' },
  { path: '/act/:actId/products', Component: ProductListPage, title: 'Product List' },
];