import { TPayment, IValidationResult } from '../../types';

// Исправляем интерфейс IBuyer чтобы payment был optional
interface IBuyer {
    payment?: TPayment;    // Делаем payment опциональным
    email: string;
    phone: string;
    address: string;
}

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
        // Возвращаем объект без payment если он null
        const data: IBuyer = {
            email: this.email,
            phone: this.phone,
            address: this.address
        };

        // Добавляем payment только если он не null
        if (this.payment !== null) {
            data.payment = this.payment;
        }

        return data;
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