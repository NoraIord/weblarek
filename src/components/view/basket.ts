import { Component } from '../base/component';

interface IBasket {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

interface IBasketActions {
    onCheckout: () => void;
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

    // Сделаем сеттеры публичными
    public set items(items: HTMLElement[]) {
        console.log('Basket: устанавливаем items', items.length);
        this._list.innerHTML = '';
        if (items.length > 0) {
            items.forEach(item => {
                console.log('Basket: добавляем item', item);
                this._list.appendChild(item);
            });
        }
    }

    public set total(total: number) {
        console.log('Basket: устанавливаем total', total);
        this.setText(this._total, `${total} синапсов`);
    }

    public set buttonDisabled(state: boolean) {
        console.log('Basket: устанавливаем buttonDisabled', state);
        this.setDisabled(this._button, state);
    }

    render(data?: Partial<IBasket>): HTMLElement {
        console.log('Basket: render с данными', data);
        super.render(data);
        return this.container;
    }
}