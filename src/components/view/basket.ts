// components/view/basket.ts
import { Component } from '../base/component';

interface IBasket {
    items: HTMLElement[];
    total: number;
}

interface IBasketActions {
    onCheckout?: () => void;
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container);

        const list = this.container.querySelector('.basket__list');
        const total = this.container.querySelector('.basket__price');
        const button = this.container.querySelector('.basket__button');

        if (!list || !total || !button) {
            throw new Error('Не найдены необходимые элементы корзины');
        }

        this._list = list as HTMLElement;
        this._total = total as HTMLElement;
        this._button = button as HTMLButtonElement;

        if (actions?.onCheckout) {
            this._button.addEventListener('click', actions.onCheckout);
        }
    }

    set items(items: HTMLElement[]) {
        this._list.innerHTML = '';
        items.forEach(item => {
            this._list.appendChild(item);
        });
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set buttonDisabled(state: boolean) {
        this.setDisabled(this._button, state);
    }
}