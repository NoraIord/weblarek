// components/models/buyer-model.ts
import { IBuyer, TPayment, IValidationResult } from '../../types';
import { EventEmitter } from '../base/events';

export class BuyerModel extends EventEmitter {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setData(data: Partial<IBuyer>): void {
        let changed = false;

        if (data.payment !== undefined && data.payment !== this.payment) {
            this.payment = data.payment;
            changed = true;
        }
        if (data.email !== undefined && data.email !== this.email) {
            this.email = data.email;
            changed = true;
        }
        if (data.phone !== undefined && data.phone !== this.phone) {
            this.phone = data.phone;
            changed = true;
        }
        if (data.address !== undefined && data.address !== this.address) {
            this.address = data.address;
            changed = true;
        }

        if (changed) {
            console.log('BuyerModel: данные обновлены', this.getData());
            this.emit('buyerModel:changed', this.getData());
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.emit('buyerModel:changed', this.getData());
    }

    validate(): IValidationResult {
        console.log('BuyerModel: валидация данных', this.getData());

        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес';
        }

        const isValid = Object.keys(errors).length === 0;
        console.log('Результат валидации:', { isValid, errors });

        return {
            isValid,
            errors
        };
    }
}