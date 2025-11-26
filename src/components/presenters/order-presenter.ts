import { BasketModel } from '../models/basket-model';
import { BuyerModel } from '../models/buyer-model';
import { ShopApi } from '../api/shop-api';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export class OrderPresenter {
    constructor(
        private basketModel: BasketModel,
        private buyerModel: BuyerModel,
        private shopApi: ShopApi
    ) {}

    startOrder(): void {
        console.log('🎯 OrderPresenter.startOrder() ВЫЗВАН');
        this.buyerModel.clear();
        this.renderPaymentStep();
    }

    private renderPaymentStep(): void {
        console.log('💰 renderPaymentStep ВЫЗВАН');

        try {
            const modalContainer = ensureElement<HTMLElement>('#modal-container');
            console.log('🔍 Modal container до:', modalContainer.className);

            // ОЧИЩАЕМ ВСЕ СУЩЕСТВУЮЩИЕ КЛАССЫ и добавляем modal_active
            modalContainer.className = 'modal modal_active';
            console.log('🔍 Modal container после:', modalContainer.className);

            const modalContent = ensureElement<HTMLElement>('.modal__content', modalContainer);
            const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

            if (!orderTemplate) {
                console.error('❌ Order template НЕ НАЙДЕН в DOM');
                return;
            }

            // ОЧИЩАЕМ и добавляем новый контент
            modalContent.innerHTML = '';
            const orderContent = orderTemplate.content.cloneNode(true) as DocumentFragment;
            modalContent.appendChild(orderContent);

            console.log('✅ Модальное окно оформления ОТКРЫТО!');

            this.setupPaymentForm(modalContent);
            this.setupModalClose(modalContainer);

        } catch (error) {
            console.error('❌ Ошибка в renderPaymentStep:', error);
        }
    }

    private setupPaymentForm(formElement: HTMLElement): void {
        console.log('💰 setupPaymentForm вызван');

        const form = formElement.querySelector('form[name="order"]') as HTMLFormElement;
        if (!form) {
            console.error('❌ Form not found');
            return;
        }

        const onlineButton = form.querySelector('button[name="card"]') as HTMLButtonElement;
        const offlineButton = form.querySelector('button[name="cash"]') as HTMLButtonElement;
        const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorsElement = form.querySelector('.form__errors') as HTMLElement;

        console.log('🔍 Классы кнопок ДО:', {
            online: onlineButton.className,
            offline: offlineButton.className
        });

        let selectedPayment: TPayment | null = null;

        const selectPayment = (payment: TPayment, button: HTMLButtonElement) => {
            console.log('💳 Выбран способ оплаты:', payment);

            // Сбрасываем активные классы с обеих кнопок
            onlineButton.className = 'button button_alt';
            offlineButton.className = 'button button_alt';

            // Добавляем активный класс к выбранной кнопке
            // Попробуем разные варианты классов:
            button.classList.add('button_active');    // вариант 1
            button.classList.add('active');           // вариант 2
            button.classList.add('button_alt-active'); // вариант 3

            console.log('🔍 Классы кнопок ПОСЛЕ:', {
                online: onlineButton.className,
                offline: offlineButton.className
            });

            selectedPayment = payment;
            this.buyerModel.setData({ payment });
            validateForm();
        };


        // Обработчики кнопок оплаты
        onlineButton.addEventListener('click', () => selectPayment('online', onlineButton));
        offlineButton.addEventListener('click', () => selectPayment('offline', offlineButton));

        // Валидация адреса
        addressInput.addEventListener('input', () => {
            this.buyerModel.setData({ address: addressInput.value });
            validateForm();
        });

        // Функция валидации формы
        const validateForm = () => {
            const isPaymentSelected = selectedPayment !== null;
            const isAddressFilled = addressInput.value.trim().length > 0;
            const isFormValid = isPaymentSelected && isAddressFilled;

            submitButton.disabled = !isFormValid;

            // Показываем ошибки
            if (!isPaymentSelected) {
                errorsElement.textContent = 'Выберите способ оплаты';
            } else if (!isAddressFilled) {
                errorsElement.textContent = 'Введите адрес доставки';
            } else {
                errorsElement.textContent = '';
            }

            console.log('📝 Валидация формы:', {
                payment: selectedPayment,
                address: addressInput.value,
                isValid: isFormValid
            });
        };

        // Обработка отправки формы
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('📝 Форма оплаты отправлена');

            if (!submitButton.disabled) {
                console.log('✅ Форма валидна, переходим к контактам');
                this.renderContactsStep();
            } else {
                console.log('❌ Форма невалидна');
            }
        });

        // Инициализируем валидацию
        validateForm();
    }

    private renderContactsStep(): void {
        console.log('📞 renderContactsStep вызван');

        try {
            const modalContainer = ensureElement<HTMLElement>('#modal-container');
            const modalContent = ensureElement<HTMLElement>('.modal__content', modalContainer);
            const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;

            if (!contactsTemplate) {
                console.error('❌ Contacts template не найден');
                return;
            }

            // Очищаем и добавляем контент контактов
            modalContent.innerHTML = '';
            const contactsContent = contactsTemplate.content.cloneNode(true) as DocumentFragment;
            modalContent.appendChild(contactsContent);

            console.log('✅ Форма контактов загружена');

            this.setupContactsForm(modalContent);

        } catch (error) {
            console.error('❌ Ошибка в renderContactsStep:', error);
        }
    }

    private setupContactsForm(formElement: HTMLElement): void {
        console.log('📞 setupContactsForm вызван');

        const form = formElement.querySelector('form[name="contacts"]') as HTMLFormElement;
        if (!form) {
            console.error('❌ Contacts form not found');
            return;
        }

        const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorsElement = form.querySelector('.form__errors') as HTMLElement;

        console.log('🔍 Элементы формы контактов найдены:', {
            emailInput: !!emailInput,
            phoneInput: !!phoneInput,
            submitButton: !!submitButton,
            errorsElement: !!errorsElement
        });

        // Валидация email
        emailInput.addEventListener('input', () => {
            this.buyerModel.setData({ email: emailInput.value });
            validateContactsForm();
        });

        // Валидация телефона
        phoneInput.addEventListener('input', () => {
            this.buyerModel.setData({ phone: phoneInput.value });
            validateContactsForm();
        });

        // Функция валидации контактов
        const validateContactsForm = () => {
            const isEmailValid = this.validateEmail(emailInput.value);
            const isPhoneValid = this.validatePhone(phoneInput.value);
            const isFormValid = isEmailValid && isPhoneValid;

            submitButton.disabled = !isFormValid;

            // Показываем ошибки
            const errors: string[] = [];
            if (!isEmailValid && emailInput.value) errors.push('Некорректный email');
            if (!isPhoneValid && phoneInput.value) errors.push('Некорректный телефон');

            errorsElement.textContent = errors.join(', ');

            console.log('📞 Валидация контактов:', {
                email: emailInput.value,
                phone: phoneInput.value,
                isValid: isFormValid
            });
        };

        // Обработка отправки формы контактов
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('📞 Форма контактов отправлена');

            if (!submitButton.disabled) {
                console.log('✅ Контакты валидны, оформляем заказ');
                await this.submitOrder();
            } else {
                console.log('❌ Контакты невалидны');
            }
        });

        // Инициализируем валидацию
        validateContactsForm();
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePhone(phone: string): boolean {
        // Простая валидация телефона
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }

    private async submitOrder(): Promise<void> {
        try {
            const buyerData = this.buyerModel.getData();
            const basketItems = this.basketModel.getItems();

            const orderData = {
                payment: buyerData.payment,
                email: buyerData.email,
                phone: buyerData.phone,
                address: buyerData.address,
                total: this.basketModel.getTotalPrice(),
                items: basketItems.map(item => item.id) // Просто массив ID товаров
            };

            console.log('📦 Данные заказа:', orderData);
            const result = await this.shopApi.createOrder(orderData);

            console.log('✅ Заказ создан:', result);
            this.showSuccess(result.total);
            this.basketModel.clear();
            this.updateBasketCounter();

        } catch (error) {
            console.error('❌ Ошибка при создании заказа:', error);
            this.showError('Ошибка при оформлении заказа');
        }
    }

    private showSuccess(total: number): void {
        console.log('🎉 Показываем экран успеха');

        const modalContainer = ensureElement<HTMLElement>('#modal-container');
        const modalContent = ensureElement<HTMLElement>('.modal__content', modalContainer);
        const successTemplate = document.getElementById('success') as HTMLTemplateElement;

        if (!successTemplate) {
            console.error('❌ Success template не найден');
            return;
        }

        // Очищаем и добавляем контент успеха
        modalContent.innerHTML = '';
        const successContent = successTemplate.content.cloneNode(true) as DocumentFragment;
        modalContent.appendChild(successContent);

        // Обновляем сумму
        const description = modalContent.querySelector('.order-success__description') as HTMLElement;
        if (description) {
            description.textContent = `Списано ${total} синапсов`;
        }

        // Настраиваем кнопку закрытия
        const closeButton = modalContent.querySelector('.order-success__close') as HTMLButtonElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log('🎉 Заказ завершен, закрываем модальное окно');

                // ОЧИЩАЕМ КОРЗИНУ ПЕРЕД ЗАКРЫТИЕМ
                this.basketModel.clear();
                console.log('🛒 Корзина очищена');

                // ОБНОВЛЯЕМ СЧЕТЧИК В ШАПКЕ
                this.updateBasketCounter();

                this.closeModal();
            });
        }

        console.log('✅ Экран успеха показан');
    }

    private showError(message: string): void {
        console.log('❌ Показываем ошибку:', message);

        const modalContainer = ensureElement<HTMLElement>('#modal-container');
        const modalContent = ensureElement<HTMLElement>('.modal__content', modalContainer);

        modalContent.innerHTML = `
            <div class="order-error">
                <h2 class="order-error__title">Ошибка</h2>
                <p class="order-error__description">${message}</p>
                <button class="button order-error__close">Понятно</button>
            </div>
        `;

        const closeButton = modalContent.querySelector('.order-error__close') as HTMLButtonElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }
    }

    private setupModalClose(modalContainer: HTMLElement): void {
        console.log('🔒 Настраиваем закрытие модального окна оформления');

        const closeButton = modalContainer.querySelector('.modal__close') as HTMLButtonElement;

        if (closeButton) {
            // Удаляем старые обработчики и добавляем новый
            const newCloseButton = closeButton.cloneNode(true) as HTMLButtonElement;
            closeButton.parentNode?.replaceChild(newCloseButton, closeButton);

            newCloseButton.addEventListener('click', () => {
                console.log('❌ Кнопка закрытия оформления нажата');
                this.closeModal();
            });
        }

        // Обработчик клика по оверлею
        const overlayHandler = (event: MouseEvent) => {
            if (event.target === modalContainer) {
                console.log('❌ Клик по оверлею оформления');
                this.closeModal();
            }
        };

        modalContainer.addEventListener('click', overlayHandler);
    }

    private closeModal(): void {
        console.log('🔒 OrderPresenter: Закрываем модальное окно оформления');
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.classList.remove('modal_active');
            // Возвращаем базовый класс
            modalContainer.className = 'modal';
        }
    }

    private updateBasketCounter(): void {
        console.log('🔄 Обновляем счетчик корзины в шапке');

        const basketCounter = document.querySelector('.header__basket-counter');
        if (basketCounter) {
            const count = this.basketModel.getItemsCount();
            basketCounter.textContent = count.toString();
            console.log('✅ Счетчик обновлен:', count);
        } else {
            console.log('❌ Счетчик корзины не найден в шапке');
        }
    }
}