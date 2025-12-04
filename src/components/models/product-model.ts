import { IProduct } from '../../types';
import { EventEmitter } from '../base/events';

export class ProductModel extends EventEmitter {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    setItems(products: IProduct[]): void {
        this.items = products;
        this.emit('productModel:itemsChanged', this.items);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.emit('productModel:selectedChanged', product);
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }
}