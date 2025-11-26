// src/components/views/basket-view.ts

import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

interface IBasketItem {
    id: string;
    index: number;
    title: string;
    price: number;
    quantity: number;
}

interface IBasketActions {
    onRemove: (index: number) => void;
    onCheckout: () => void;
}

export class BasketView extends Component<{ items: IBasketItem[]; totalPrice: number }> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    private _onRemove?: (index: number) => void;
    private _onCheckout?: () => void;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (actions?.onCheckout) {
            this._onCheckout = actions.onCheckout;
            this._button.addEventListener('click', this._onCheckout);
        }

        if (actions?.onRemove) {
            this._onRemove = actions.onRemove;
        }
    }

    set items(items: IBasketItem[]) {
        this._list.innerHTML = '';

        if (items.length === 0) {
            this.setDisabled(this._button, true);
            this.buttonText = 'Корзина пуста';
            return;
        }

        this.setDisabled(this._button, false);
        this.buttonText = 'Оформить';

        items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('li');
            itemElement.className = 'basket__item card card_compact';

            const quantityText = item.quantity > 1 ? ` (${item.quantity} шт.)` : '';
            const totalPrice = item.price * item.quantity;

            itemElement.innerHTML = `
                <span class="basket__item-index">${item.index}</span>
                <span class="card__title">${item.title}${quantityText}</span>
                <span class="card__price">${totalPrice} синапсов</span>
                <button class="basket__item-delete card__button" aria-label="удалить"></button>
            `;

            const deleteButton = itemElement.querySelector('.basket__item-delete');
            if (deleteButton && this._onRemove) {
                deleteButton.addEventListener('click', () => {
                    this._onRemove!(itemIndex);
                });
            }

            this._list.appendChild(itemElement);
        });
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }
}