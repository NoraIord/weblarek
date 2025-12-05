// components/view/success.ts
import { Component } from '../base/component';

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick?: () => void;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        const total = this.container.querySelector('.order-success__description');
        const button = this.container.querySelector('.order-success__close');

        if (!total || !button) {
            throw new Error('Не найдены необходимые элементы успешного оформления');
        }

        this._total = total as HTMLElement;
        this._button = button as HTMLButtonElement;

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}