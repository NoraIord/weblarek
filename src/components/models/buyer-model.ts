// src/components/models/buyer-model.ts

import { IBuyer, TPayment, IValidationResult } from '../../types';

export class BuyerModel {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment) this.payment = data.payment;
        if (data.email) this.email = data.email;
        if (data.phone) this.phone = data.phone;
        if (data.address) this.address = data.address;
    }

    getData(): IBuyer {
        return {
            payment: this.payment!,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validate(): IValidationResult {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.email.trim()) errors.email = 'Укажите email';
        if (!this.phone.trim()) errors.phone = 'Укажите телефон';
        if (!this.address.trim()) errors.address = 'Укажите адрес';

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}