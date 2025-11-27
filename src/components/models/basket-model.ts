// src/components/models/basket-model.ts

import { IProduct } from '../../types';

export class BasketModel {
    private items: IProduct[] = [];

    // Добавляем тип для параметра product
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    // Добавляем тип для параметра product
    removeItem(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemsCount(): number {
        return this.items.length;
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    contains(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    clear(): void {
        this.items = [];
    }
}