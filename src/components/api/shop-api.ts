import { Api } from '../base/api';
// Импортируем только нужные типы
import { IProduct, IProductsResponse, IOrderData, IOrderResult } from '../../types';

export class ShopApi {
    constructor(private api: Api) {}

    async getProductList(): Promise<IProduct[]> {
        const response = await this.api.get<IProductsResponse>('/product');
        return response.items;
    }

    async createOrder(order: IOrderData): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order', order);
    }
}