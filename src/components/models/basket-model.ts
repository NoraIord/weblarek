// src/components/models/basket-model.ts

import { IProduct } from '../../types';

export class BasketModel {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        console.log('➕ Товар добавлен в корзину:', product.title);
    }

    removeItem(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
            console.log('🗑️ Товар удален из корзины:', product.title);
        }
    }

    removeItemByIndex(index: number): void {
        if (index >= 0 && index < this.items.length) {
            const removedItem = this.items[index];
            this.items.splice(index, 1);
            console.log('🗑️ Товар удален по индексу:', removedItem.title);
        }
    }

    clear(): void {
        this.items = [];
        console.log('🛒 Корзина очищена');
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    contains(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}