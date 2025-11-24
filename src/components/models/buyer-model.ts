import { IBuyer, TPayment, IValidationResult } from '../../types';

export class BuyerModel {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment) this._payment = data.payment;
        if (data.email) this._email = data.email;
        if (data.phone) this._phone = data.phone;
        if (data.address) this._address = data.address;
    }

    getData(): IBuyer {
        if (!this._payment) throw new Error('Payment not set');
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    validate(): IValidationResult {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._payment) errors.payment = 'Не выбран способ оплаты';
        if (!this._email.trim()) errors.email = 'Укажите email';
        if (!this._phone.trim()) errors.phone = 'Укажите телефон';
        if (!this._address.trim()) errors.address = 'Укажите адрес';

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}