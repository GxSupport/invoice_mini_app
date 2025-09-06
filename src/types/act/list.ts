export interface ActListResponseFromAPi {
    current_page: number;
    data: ActListResponseData[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}
export interface ActListResponseData {
    id: string;
    actdoc: {
        actno: string;
        actdate: string;
    };
    contractdoc:{
        contractno: string;
        contractdate: string;
    };
    sellertin: string;
    buyertin: string;
    sellername: string;
    buyername: string;
    stateid: number;
    notes: string;
    payabletotal: number;
    statetext:{
        state: number;
        text: string;
        class: string;
        status: string;
    }

}
