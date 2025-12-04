import { Component } from '../base/component';
import { IBuyer, TPayment } from '../../types';

interface IOrderActions {
    onClick: (event: MouseEvent) => void;
    onSubmit: (event: SubmitEvent) => void;
}

export class Order extends Component<IBuyer> {
    protected _button: HTMLButtonElement;
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput?: HTMLInputElement;
    protected _emailInput?: HTMLInputElement;
    protected _phoneInput?: HTMLInputElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, actions?: IOrderActions) {
        super(container);

        const button = this.container.querySelector('.order__button, .button[type="submit"]');
        const paymentButtons = this.container.querySelectorAll('button[name]');
        const addressInput = this.container.querySelector('input[name="address"]');
        const emailInput = this.container.querySelector('input[name="email"]');
        const phoneInput = this.container.querySelector('input[name="phone"]');
        const errors = this.container.querySelector('.form__errors');

        if (!button || !paymentButtons || !errors) {
            throw new Error('Не найдены необходимые элементы формы заказа');
        }

        this._button = button as HTMLButtonElement;
        this._paymentButtons = paymentButtons as NodeListOf<HTMLButtonElement>;
        this._errors = errors as HTMLElement;

        if (addressInput) {
            this._addressInput = addressInput as HTMLInputElement;
        }
        if (emailInput) {
            this._emailInput = emailInput as HTMLInputElement;
        }
        if (phoneInput) {
            this._phoneInput = phoneInput as HTMLInputElement;
        }

        if (actions?.onSubmit) {
            this.container.addEventListener('submit', actions.onSubmit);
        }

        if (actions?.onClick) {
            this._paymentButtons.forEach(button => {
                button.addEventListener('click', actions.onClick);
            });
        }

        // Валидация в реальном времени
        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => this.emitChanges());
        }
        if (this._emailInput) {
            this._emailInput.addEventListener('input', () => this.emitChanges());
        }
        if (this._phoneInput) {
            this._phoneInput.addEventListener('input', () => this.emitChanges());
        }
    }

    set payment(value: TPayment) {
        this._paymentButtons.forEach(button => {
            const isActive = button.name === value;
            button.classList.toggle('button_alt-active', isActive);
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }

    set buttonDisabled(state: boolean) {
        this.setDisabled(this._button, state);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    get payment(): TPayment | null {
        const activeButton = Array.from(this._paymentButtons).find(
            button => button.classList.contains('button_alt-active')
        );
        return (activeButton?.name as TPayment) || null;
    }

    get address(): string {
        return this._addressInput?.value || '';
    }

    get email(): string {
        return this._emailInput?.value || '';
    }

    get phone(): string {
        return this._phoneInput?.value || '';
    }

    private emitChanges() {
        this.container.dispatchEvent(new Event('input', { bubbles: true }));
    }

    clear() {
        if (this._addressInput) this._addressInput.value = '';
        if (this._emailInput) this._emailInput.value = '';
        if (this._phoneInput) this._phoneInput.value = '';
        this.errors = '';
        this._paymentButtons.forEach(button =>
            button.classList.remove('button_alt-active')
        );
    }

    render(data?: Partial<IBuyer>): HTMLElement {
        super.render(data);
        return this.container;
    }
}