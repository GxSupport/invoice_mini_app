// Act detail API payload
export interface ActDetailResponse {
    data: ActDetail;
}

export interface ActDetail {
    sellertin: string | number;
    sellername: string;
    sellerbranchcode: string | null;
    sellerbranchname: string | null;

    buyertin: string | number;
    buyername: string;
    buyerbranchcode: string | null;
    buyerbranchname: string | null;

    actdoc: ActDoc;
    contractdoc: ContractDoc;

    productlist: ProductList;

    notes: string | null;
    stateid: number;
    isdraft: 0 | 1;
    payabletotal: number;
    lasterror: string | null;
    covotingstate: number;

    created_at: string;
    updated_at: string;
    id: string;

    statetext: StateText;
}

export interface ActDoc {
    actno: string;
    actdate: string; // "YYYY-MM-DD"
    acttext?: string;
}

export interface ContractDoc {
    contractno: string;
    contractdate: string; // "YYYY-MM-DD"
}

export interface ProductList {
    actproductid: string;
    tin: string | number;
    products: Product[];
}

export interface Product {
    ordno: number;
    name: string;
    measureid: number | null;
    packagecode: number;
    packagename: string;
    count: number;
    summa: number;
    totalsum: number;
    catalogcode: string;
    catalogname: string;
}

export interface StateText {
    state: number;
    text: string;
    class: string;                // e.g. "info"
    status: "info" | "success" | "warning" | "danger" | string;
}
