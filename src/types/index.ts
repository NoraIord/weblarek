// УБИРАЕМ дублирующиеся объявления
export type TPayment = 'online' | 'offline';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof IBuyer, string>>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// УБИРАЕМ дубликат IOrderData - оставляем только один
export interface IOrderData {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

