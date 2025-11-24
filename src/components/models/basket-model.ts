import { IProduct } from '../../types';

// Интерфейс для товара в корзине
interface IBasketItem {
    product: IProduct;
    quantity: number;
}

export class BasketModel {
    private _items: IBasketItem[] = [];

    getItems(): IBasketItem[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        const existingItem = this._items.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this._items.push({
                product: product,
                quantity: 1
            });
        }

        console.log('➕ Товар добавлен в корзину:', product.title);
    }

    // ДОБАВЛЯЕМ метод удаления по индексу
    removeItemByIndex(index: number): void {
        if (index >= 0 && index < this._items.length) {
            const removedItem = this._items[index];

            if (removedItem.quantity > 1) {
                removedItem.quantity -= 1;
                console.log('➖ Уменьшено количество:', removedItem.product.title);
            } else {
                this._items.splice(index, 1);
                console.log('🗑️ Удалена позиция:', removedItem.product.title);
            }
        }
    }
    // СУЩЕСТВУЮЩИЙ метод оставляем как есть
    removeItem(productId: string): void {
        const index = this._items.findIndex(item => item.product.id === productId);
        if (index !== -1) {
            this.removeItemByIndex(index);
        }
    }


    clear(): void {
        this._items = [];
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) =>
            total + (item.product.price || 0) * item.quantity, 0);
    }

    getItemsCount(): number {
        return this._items.reduce((total, item) => total + item.quantity, 0);
    }

    contains(productId: string): boolean {
        return this._items.some(item => item.product.id === productId);
    }
}