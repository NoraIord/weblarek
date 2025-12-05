// components/view/contacts.ts
import { Component } from '../base/component';
import { IBuyer } from '../../types';

interface IContactsActions {
    onSubmit?: (event: SubmitEvent) => void;
}

export class Contacts extends Component<IBuyer> {
    protected _button: HTMLButtonElement;
    protected _emailInput?: HTMLInputElement;
    protected _phoneInput?: HTMLInputElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, actions?: IContactsActions) {
        super(container);

        const button = this.container.querySelector('.button[type="submit"]');
        const emailInput = this.container.querySelector('input[name="email"]');
        const phoneInput = this.container.querySelector('input[name="phone"]');
        const errors = this.container.querySelector('.form__errors');

        if (!button || !emailInput || !phoneInput || !errors) {
            throw new Error('Не найдены необходимые элементы формы контактов');
        }

        this._button = button as HTMLButtonElement;
        this._emailInput = emailInput as HTMLInputElement;
        this._phoneInput = phoneInput as HTMLInputElement;
        this._errors = errors as HTMLElement;

        if (actions?.onSubmit) {
            this.container.addEventListener('submit', actions.onSubmit);
        }

        // Обработчики изменений
        this._emailInput.addEventListener('input', () => this.emitChanges());
        this._phoneInput.addEventListener('input', () => this.emitChanges());
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

    get email(): string {
        return this._emailInput?.value || '';
    }

    get phone(): string {
        return this._phoneInput?.value || '';
    }

    private emitChanges() {
        this.container.dispatchEvent(new Event('change', { bubbles: true }));
    }
}