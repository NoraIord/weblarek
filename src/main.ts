import './scss/styles.scss';

import { ProductModel } from './components/models/product-model';
import { BasketModel } from './components/models/basket-model';
import { BuyerModel } from './components/models/buyer-model';
import { Api } from './components/base/api';
import { ShopApi } from './components/api/shop-api';
import { Modal } from './components/view/modal';
import { Card, ICardData } from './components/view/card';
import { Basket } from './components/view/basket';
import { Order } from './components/view/order';
import { Success } from './components/view/success';
import { API_URL, CDN_URL, ensureElement, cloneTemplate } from './utils/constants';
import type { IProduct, TPayment, IOrderData } from './types';

// Инициализация приложения
class App {
    private api: ShopApi;
    private modal: Modal;

    private productModel: ProductModel;
    private basketModel: BasketModel;
    private buyerModel: BuyerModel;

    constructor() {
        console.log('🔧 Конструктор App вызван');

        // Инициализируем свойства
        this.api = new ShopApi(new Api(API_URL));
        this.productModel = new ProductModel();
        this.basketModel = new BasketModel();
        this.buyerModel = new BuyerModel();

        console.log('✅ Модели созданы');

        try {
            this.modal = new Modal(
                ensureElement<HTMLElement>('#modal-container'),
                this.productModel
            );
            console.log('✅ Модальное окно инициализировано');
        } catch (error) {
            console.error('❌ Ошибка инициализации модального окна:', error);
            this.modal = {} as Modal;
        }

        this.initEventHandlers();
        this.loadProducts();

        (window as any).app = this;
        console.log('🎉 App инициализирован, доступен как window.app');
    }

    private initEventHandlers() {
        console.log('🔗 Инициализация обработчиков событий');

        // События моделей
        this.productModel.on('productModel:itemsChanged', () => {
            console.log('📦 Событие: товары изменились');
            this.renderCatalog();
        });

        this.basketModel.on('basketModel:changed', () => {
            console.log('🛒 Событие: корзина изменилась');
            this.updateBasketCounter();
        });

        this.buyerModel.on('buyerModel:changed', () => {
            console.log('👤 Событие: данные покупателя изменились');
        });

        // События UI
        try {
            const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
            basketButton.addEventListener('click', () => {
                console.log('📌 Клик по корзине');
                this.openBasket();
            });
            console.log('✅ Обработчик корзины установлен');
        } catch (error) {
            console.error('❌ Ошибка установки обработчика корзины:', error);
        }

        // Валидация форм в реальном времени
        document.addEventListener('input', () => {
            this.validateActiveForm();
        });

        document.addEventListener('change', () => {
            this.validateActiveForm();
        });
    }

    private validateActiveForm() {
        const activeForm = document.querySelector('.modal__content form');
        if (!activeForm) return;

        const isContactsForm = activeForm.querySelector('input[name="email"]') !== null;

        try {
            const order = new Order(activeForm as HTMLElement);

            // Обновляем данные покупателя из формы
            if (isContactsForm) {
                const email = order.email;
                const phone = order.phone;
                this.buyerModel.setData({ email, phone });
                this.validateContactsForm(order);
            } else {
                const payment = order.payment;
                const address = order.address;
                this.buyerModel.setData({ payment, address });
                this.validateOrderForm(order);
            }
        } catch (error) {
            console.error('Ошибка валидации формы:', error);
        }
    }

    private async loadProducts() {
        console.log('🌐 Начинаем загрузку товаров...');

        try {
            const products = await this.api.getProductList();
            console.log(`✅ Загружено ${products.length} товаров`);

            if (products.length > 0) {
                console.log('Пример товара:', {
                    id: products[0].id,
                    title: products[0].title,
                    price: products[0].price
                });
            }

            this.productModel.setItems(products);
        } catch (error) {
            console.error('❌ Ошибка загрузки товаров:', error);
            const gallery = ensureElement<HTMLElement>('.gallery');
            gallery.innerHTML = '<div class="error">Ошибка загрузки товаров. Пожалуйста, обновите страницу.</div>';
        }
    }

    private renderCatalog() {
        console.log('🎨 Начинаем рендер каталога');

        try {
            const gallery = ensureElement<HTMLElement>('.gallery');
            const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
            const products = this.productModel.getItems();

            console.log(`📊 Будет отображено ${products.length} товаров`);

            gallery.innerHTML = '';

            products.forEach(product => {
                const cardElement = cloneTemplate<HTMLElement>(cardTemplate);
                const card = new Card(cardElement, {
                    onClick: () => {
                        console.log(`👉 Клик по "${product.title}"`);
                        this.openProductModal(product);
                    }
                });

                const cardData: ICardData = {
                    ...product,
                    image: CDN_URL + product.image
                };

                card.render(cardData);
                gallery.appendChild(card.container);
            });

            console.log('✅ Каталог отрендерен');
        } catch (error) {
            console.error('❌ Ошибка рендера каталога:', error);
        }
    }

    private openProductModal(product: IProduct) {
        console.log(`🔍 Открываем модалку для "${product.title}"`);

        try {
            const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
            const previewElement = cloneTemplate<HTMLElement>(previewTemplate);

            const card = new Card(previewElement, {
                onClick: (event: MouseEvent) => {
                    console.log(`🛒 Обработка клика для "${product.title}"`);
                    this.handleProductAction(product, event);
                }
            });

            const isInBasket = this.basketModel.contains(product.id);
            const buttonText = isInBasket ? 'Удалить из корзины' : 'В корзину';
            const buttonDisabled = product.price === null;

            const cardData: ICardData = {
                ...product,
                image: CDN_URL + product.image,
                buttonText,
                buttonDisabled,
                description: product.description || 'Описание отсутствует'
            };

            card.render(cardData);
            this.modal.render({ content: card.container });
            this.modal.open();

            console.log(`✅ Модалка открыта для "${product.title}"`);
        } catch (error) {
            console.error(`❌ Ошибка открытия модалки для "${product.title}":`, error);
        }
    }

    private handleProductAction(product: IProduct, event: MouseEvent) {
        const target = event.target as HTMLButtonElement;
        console.log(`🎯 Клик по кнопке: "${target.textContent}"`);

        if (target.classList.contains('card__button')) {
            if (this.basketModel.contains(product.id)) {
                console.log(`🗑️ Удаляем "${product.title}" из корзины`);
                this.basketModel.removeItem(product.id);
            } else if (product.price !== null) {
                console.log(`➕ Добавляем "${product.title}" в корзину`);
                this.basketModel.addItem(product);
            } else {
                console.log(`⛔ Товар "${product.title}" без цены, нельзя добавить`);
            }
            this.modal.close();
        }
    }

    private openBasket() {
        console.log('📦 Открываем корзину');

        try {
            const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
            const basketElement = cloneTemplate<HTMLElement>(basketTemplate);

            const basket = new Basket(basketElement, {
                onCheckout: () => {
                    console.log('💳 Нажата кнопка оформления');
                    this.openOrderForm();
                }
            });

            const items = this.basketModel.getItems();
            const total = this.basketModel.getTotalPrice();

            console.log(`📊 В корзине: ${items.length} товаров на сумму ${total}`);

            if (items.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.textContent = 'Корзина пуста';
                emptyMessage.className = 'basket__empty';
                basket.items = [emptyMessage];
                basket.buttonDisabled = true;
                console.log('📭 Корзина пуста');
            } else {
                const basketItems: HTMLElement[] = [];

                items.forEach((item, index) => {
                    const itemElement = this.createBasketItem(item, index + 1);
                    basketItems.push(itemElement);
                });

                basket.items = basketItems;
                basket.buttonDisabled = false;
                console.log(`📋 Показано ${items.length} товаров`);
            }

            basket.total = total;

            this.modal.render({ content: basket.container });
            this.modal.open();

            console.log('✅ Корзина открыта');
        } catch (error) {
            console.error('❌ Ошибка открытия корзины:', error);
        }
    }

    private createBasketItem(product: IProduct, index: number): HTMLElement {
        console.log(`🛒 Создаем элемент корзины для: ${product.title}`);

        try {
            // Получаем шаблон
            const template = ensureElement<HTMLTemplateElement>('#card-basket');

            // Клонируем шаблон
            const item = cloneTemplate<HTMLElement>(template);
            console.log('✅ Шаблон клонирован, элемент:', item.tagName, item.className);

            // Находим элементы ВНУТРИ item
            const title = item.querySelector('.card__title');
            const price = item.querySelector('.card__price');
            const indexElement = item.querySelector('.basket__item-index');
            const deleteButton = item.querySelector('.basket__item-delete');

            // Заполняем данные
            if (title) {
                title.textContent = product.title;
            }

            if (price) {
                const priceText = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
                price.textContent = priceText;
            }

            if (indexElement) {
                indexElement.textContent = index.toString();
            }

            // Добавляем обработчик удаления
            if (deleteButton) {
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    console.log(`🗑️ Удаляем: ${product.title}`);
                    this.basketModel.removeItem(product.id);
                });
            }

            return item;

        } catch (error) {
            console.error(`❌ Ошибка при создании элемента для ${product.title}:`, error);

            // Создаем простой элемент как запасной вариант
            return this.createSimpleBasketItem(product, index);
        }
    }

    private createSimpleBasketItem(product: IProduct, index: number): HTMLElement {
        const li = document.createElement('li');
        li.className = 'basket__item card card_compact';
        li.innerHTML = `
            <span class="basket__item-index">${index}</span>
            <span class="card__title">${product.title}</span>
            <span class="card__price">${product.price} синапсов</span>
            <button class="basket__item-delete card__button" aria-label="удалить">×</button>
        `;

        const deleteBtn = li.querySelector('.basket__item-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.basketModel.removeItem(product.id);
            });
        }

        return li;
    }

    private updateBasketCounter() {
        try {
            const counter = ensureElement<HTMLElement>('.header__basket-counter');
            const count = this.basketModel.getItemsCount();
            counter.textContent = count.toString();
            console.log(`🔢 Счетчик корзины обновлен: ${count}`);
        } catch (error) {
            console.error('❌ Ошибка обновления счетчика:', error);
        }
    }

    private openOrderForm() {
        console.log('📄 Открываем форму заказа (первый шаг)');

        try {
            const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
            const orderElement = cloneTemplate<HTMLElement>(orderTemplate);

            const order = new Order(orderElement, {
                onClick: (event: MouseEvent) => {
                    this.handlePaymentSelect(event);
                },
                onSubmit: (event: SubmitEvent) => {
                    event.preventDefault();
                    this.proceedToContacts();
                }
            });

            // Заполняем сохраненными данными
            const buyerData = this.buyerModel.getData();
            order.render(buyerData);

            // Проверяем валидность
            this.validateOrderForm(order);

            this.modal.render({ content: order.container });
            this.modal.open();

            console.log('✅ Форма заказа открыта');
        } catch (error) {
            console.error('❌ Ошибка открытия формы заказа:', error);
        }
    }

    private handlePaymentSelect(event: MouseEvent) {
        const button = event.target as HTMLButtonElement;

        if (button.name === 'card' || button.name === 'cash') {
            const payment: TPayment = button.name === 'card' ? 'online' : 'offline';
            console.log('💳 Выбран способ оплаты:', payment);
            this.buyerModel.setData({ payment });

            // Обновляем UI кнопок
            const buttons = document.querySelectorAll('.order__buttons button');
            buttons.forEach(btn => {
                const btnElement = btn as HTMLButtonElement;
                if (btnElement.name === button.name) {
                    btnElement.classList.add('button_alt-active');
                } else {
                    btnElement.classList.remove('button_alt-active');
                }
            });
        }
    }

    private validateOrderForm(order: Order) {
        const buyerData = this.buyerModel.getData();

        // Проверяем только поля первого шага
        const hasPayment = buyerData.payment !== null;
        const hasAddress = buyerData.address.trim() !== '';
        const isValid = hasPayment && hasAddress;

        order.buttonDisabled = !isValid;

        if (!isValid) {
            const errors = [];
            if (!hasPayment) errors.push('Выберите способ оплаты');
            if (!hasAddress) errors.push('Введите адрес доставки');
            order.errors = errors.join(', ');
        } else {
            order.errors = '';
        }
    }

    private proceedToContacts() {
        console.log('➡️ Переход к форме контактов');

        // Получаем данные из формы
        const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
        const address = addressInput ? addressInput.value.trim() : '';

        // Получаем выбранный способ оплаты
        const activePaymentButton = document.querySelector('.button_alt-active') as HTMLButtonElement;
        const payment = activePaymentButton ?
            (activePaymentButton.name === 'card' ? 'online' as TPayment : 'offline' as TPayment) :
            null;

        console.log('Данные из формы:', { payment, address });

        // Проверяем только поля первого шага
        const errors: string[] = [];

        if (!payment) {
            errors.push('Выберите способ оплаты');
        }

        if (!address) {
            errors.push('Введите адрес доставки');
        }

        if (errors.length > 0) {
            console.log('Ошибки первого шага:', errors);
            const errorElement = document.querySelector('.form__errors');
            if (errorElement) {
                errorElement.textContent = errors.join(', ');
            }
            return;
        }

        // Сохраняем данные
        this.buyerModel.setData({
            payment,
            address
        });

        console.log('✅ Первый шаг пройден, открываем форму контактов');
        this.openContactsForm();
    }

    private openContactsForm() {
        console.log('📞 Открываем форму контактов');

        try {
            const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
            const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);

            const contactsForm = new Order(contactsElement, {
                onClick: () => {}, // В форме контактов нет кнопок оплаты
                onSubmit: (event: SubmitEvent) => {
                    event.preventDefault();
                    this.submitOrder();
                }
            });

            // Заполняем сохраненными данными
            const buyerData = this.buyerModel.getData();
            contactsForm.render(buyerData);

            // Проверяем валидность
            this.validateContactsForm(contactsForm);

            this.modal.render({ content: contactsForm.container });
            this.modal.open();

            console.log('✅ Форма контактов открыта');
        } catch (error) {
            console.error('❌ Ошибка открытия формы контактов:', error);
        }
    }

    private validateContactsForm(form: Order) {
        const validation = this.buyerModel.validate();

        // Проверяем все поля
        form.buttonDisabled = !validation.isValid;

        if (!validation.isValid) {
            const errors = Object.values(validation.errors).filter(Boolean).join(', ');
            form.errors = errors;
        } else {
            form.errors = '';
        }
    }

    private async submitOrder() {
        console.log('🚀 Отправка заказа');

        try {
            // Получаем данные из формы
            const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
            const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;

            if (emailInput && phoneInput) {
                this.buyerModel.setData({
                    email: emailInput.value,
                    phone: phoneInput.value
                });
            }

            // Проверяем валидность
            const validation = this.buyerModel.validate();
            if (!validation.isValid) {
                console.log('Ошибки валидации:', validation.errors);
                const errorElement = document.querySelector('.form__errors');
                if (errorElement) {
                    const errors = Object.values(validation.errors).filter(Boolean).join(', ');
                    errorElement.textContent = errors;
                }
                return;
            }

            const buyerData = this.buyerModel.getData();
            const items = this.basketModel.getItems();

            if (items.length === 0) {
                console.error('Корзина пуста');
                alert('Корзина пуста!');
                return;
            }

            // Формируем данные заказа
            const orderData: IOrderData = {
                payment: buyerData.payment!,
                email: buyerData.email,
                phone: buyerData.phone,
                address: buyerData.address,
                total: this.basketModel.getTotalPrice(),
                items: items.map(item => item.id)
            };

            console.log('📤 Отправляем заказ:', orderData);

            // Отправляем на сервер
            const result = await this.api.createOrder(orderData);
            console.log('✅ Заказ оформлен:', result);

            // Показываем успех
            this.showSuccess(result.total);

            // Очищаем корзину и данные покупателя
            this.basketModel.clear();
            this.buyerModel.clear();

        } catch (error) {
            console.error('❌ Ошибка оформления заказа:', error);
            const errorElement = document.querySelector('.form__errors');
            if (errorElement) {
                errorElement.textContent = 'Ошибка оформления заказа. Попробуйте еще раз.';
            }
        }
    }

    private showSuccess(total: number) {
        console.log('🎉 Показываем успешное оформление');

        try {
            const successTemplate = ensureElement<HTMLTemplateElement>('#success');
            const successElement = cloneTemplate<HTMLElement>(successTemplate);

            const success = new Success(successElement, {
                onClick: () => {
                    console.log('Закрытие окна успеха');
                    this.modal.close();
                }
            });

            success.total = total;

            this.modal.render({ content: success.container });
            this.modal.open();

            console.log('✅ Окно успеха показано');
        } catch (error) {
            console.error('❌ Ошибка показа окна успеха:', error);
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM загружен, запускаем App');
    new App();
});