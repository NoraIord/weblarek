// src/components/models/product-model.ts

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

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}