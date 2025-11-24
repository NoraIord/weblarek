import { IProduct } from '../../types';

export class ProductModel {
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    setItems(products: IProduct[]): void {
        this._items = products;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}