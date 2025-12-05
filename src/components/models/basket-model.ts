// components/models/basket-model.ts
import { IProduct } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketModel extends EventEmitter {
    private items: IProduct[] = [];

    addItem(product: IProduct): void {
        console.log('BasketModel: добавляем товар', product.id);
        if (!this.contains(product.id)) {
            this.items.push(product);
            console.log('BasketModel: товар добавлен, эмитим событие');
            this.emit('basketModel:changed', this.items);
        } else {
            console.log('BasketModel: товар уже в корзине');
        }
    }

    removeItem(productId: string): void {
        console.log('BasketModel: удаляем товар', productId);
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            console.log('BasketModel: товар удален, эмитим событие');
            this.emit('basketModel:changed', this.items);
        } else {
            console.log('BasketModel: товар не найден в корзине');
        }
    }

    getItems(): IProduct[] {
        return [...this.items]; // Возвращаем копию массива
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
        console.log('BasketModel: очищаем корзину');
        this.items = [];
        this.emit('basketModel:changed', this.items);
    }
}