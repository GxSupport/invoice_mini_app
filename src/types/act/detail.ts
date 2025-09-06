export interface ActDetailResponse {
  data: ActDetail;
}

export interface ActDetail {
  id: string;
  actdoc: ActDoc;
  contractdoc: ContractDoc | null;
  sellername: string;
  buyername: string;
  sellertin: string;
  buyertin: string;
  sellerbranchcode?: string | null;
  sellerbranchname?: string | null;
  buyerbranchcode?: string | null;
  buyerbranchname?: string | null;
  payabletotal: number;
  productlist: ProductList;
  statetext: StateText;
  notes?: string | null;
  lasterror?: string | null;
  created_at: string;
  updated_at: string;
  filter: {
    actdate?: string | null;
    contractdate?: string | null;
  };
}

export interface ActDoc {
  actno: string;
  actdate: string; // YYYY-MM-DD format
  acttext?: string | null;
}

export interface ContractDoc {
  contractno: string;
  contractdate: string; // YYYY-MM-DD format
}

export interface ProductList {
  products: Product[];
}

export interface Product {
  ordno: number;
  name: string;
  count: number;
  summa: number;
  totalsum: number;
  packagename?: string | null;
  catalogcode?: string | null;
}

export interface StateText {
  state: number;
  text: string;
  class: string;
  status: 'success' | 'info' | 'processing' | 'warning' | 'danger' | 'neutral' | 'error' | 'draft';
}
