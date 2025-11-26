// src/components/models/basket-model.ts

import { IProduct } from '../../types';

export class ProductModel {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    setItems(products: IProduct[]): void {
        this.items = products;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}