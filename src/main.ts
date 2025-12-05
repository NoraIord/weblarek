// main.ts
import './scss/styles.scss';

import { ProductModel } from './components/models/product-model';
import { BasketModel } from './components/models/basket-model';
import { BuyerModel } from './components/models/buyer-model';
import { Api } from './components/base/api';
import { ShopApi } from './components/api/shop-api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/view/modal';
import { Card, ICardData } from './components/view/card';
import { Basket } from './components/view/basket';
import { Order } from './components/view/order';
import { Contacts } from './components/view/contacts';
import { Success } from './components/view/success';
import { Page } from './components/view/page';
import { API_URL, CDN_URL, ensureElement, cloneTemplate } from './utils/constants';
import type { IProduct, TPayment, IOrderData } from './types';

// Инициализация приложения
class App {
    private api: ShopApi;
    private events: EventEmitter;
    private modal: Modal;
    private page: Page;

    private productModel: ProductModel;
    private basketModel: BasketModel;
    private buyerModel: BuyerModel;

    // Флаг для отслеживания открытой корзины
    private isBasketOpen: boolean = false;
    // Текущий экземпляр корзины
    private currentBasket: Basket | null = null;

    // Создаем формы один раз при инициализации
    private orderForm: Order | null = null;
    private contactsForm: Contacts | null = null;

    constructor() {
        console.log('🔧 Конструктор App вызван');

        // Инициализируем EventEmitter
        this.events = new EventEmitter();

        // Инициализируем API с корректной проверкой ошибок
        this.api = new ShopApi(new Api(API_URL));

        // Инициализируем модели
        this.productModel = new ProductModel();
        this.basketModel = new BasketModel();
        this.buyerModel = new BuyerModel();

        // Инициализируем Page
        this.page = new Page(ensureElement<HTMLElement>('.page'));

        // Инициализируем Modal с передачей events
        this.modal = new Modal(
            ensureElement<HTMLElement>('#modal-container'),
            this.events
        );

        this.initEventHandlers();
        this.loadProducts();

        console.log('🎉 App инициализирован');
    }

    private initEventHandlers() {
        console.log('🔗 Инициализация обработчиков событий');

        // Подписываемся на изменения продуктов
        this.productModel.on('productModel:itemsChanged', () => {
            this.renderCatalog();
        });

        // Подписываемся на изменения корзины
        this.basketModel.on('basketModel:changed', () => {
            this.updateBasketCounter();

            // Если корзина открыта - обновляем ее
            if (this.isBasketOpen && this.currentBasket) {
                this.updateBasketContent();
            }
        });

        // Подписываемся на события модального окна
        this.events.on('modal:close', () => {
            this.isBasketOpen = false;
            this.currentBasket = null;
        });

        this.events.on('modal:open', () => {
            // Можно отслеживать открытие модального окна
        });

        // Обработчик клика на корзину в хедере через Page
        this.page.basketButtonHandler = () => {
            this.openBasket();
        };
    }

    private async loadProducts() {
        console.log('🌐 Начинаем загрузку товаров...');

        try {
            const products = await this.api.getProductList();
            console.log(`✅ Загружено ${products.length} товаров`);

            this.productModel.setItems(products);
        } catch (error) {
            console.error('❌ Ошибка загрузки товаров:', error);
            this.page.gallery = [this.createErrorElement('Ошибка загрузки товаров. Пожалуйста, обновите страницу.')];
        }
    }

    private createErrorElement(message: string): HTMLElement {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        return errorDiv;
    }

    private renderCatalog() {
        console.log('🎨 Начинаем рендер каталога');

        try {
            const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
            const products = this.productModel.getItems();
            const galleryItems: HTMLElement[] = [];

            products.forEach(product => {
                const cardElement = cloneTemplate<HTMLElement>(cardTemplate);
                const card = new Card(cardElement, {
                    onClick: () => {
                        this.openProductModal(product);
                    }
                });

                const cardData: ICardData = {
                    ...product,
                    image: CDN_URL + product.image
                };

                card.render(cardData);
                galleryItems.push(card.container);
            });

            this.page.gallery = galleryItems;
            console.log('✅ Каталог отрендерен');
        } catch (error) {
            console.error('❌ Ошибка рендера каталога:', error);
            this.page.gallery = [this.createErrorElement('Ошибка отображения каталога')];
        }
    }

    private openProductModal(product: IProduct) {
        console.log(`🔍 Открываем модалку для "${product.title}"`);

        // Сбрасываем флаг корзины
        this.isBasketOpen = false;
        this.currentBasket = null;

        try {
            const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
            const previewElement = cloneTemplate<HTMLElement>(previewTemplate);

            const card = new Card(previewElement, {
                onClick: (event: MouseEvent) => {
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

        if (target.classList.contains('card__button')) {
            if (this.basketModel.contains(product.id)) {
                console.log(`🗑️ Удаляем "${product.title}" из корзины`);
                this.basketModel.removeItem(product.id);
            } else if (product.price !== null) {
                console.log(`➕ Добавляем "${product.title}" в корзину`);
                this.basketModel.addItem(product);
            } else {
                console.log(`⛔ Товар "${product.title}" без цены, нельзя добавить`);
                return;
            }
            this.modal.close();
        }
    }

    private openBasket() {
        console.log('📦 Открываем корзину');
        this.isBasketOpen = true;

        try {
            const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
            const basketElement = cloneTemplate<HTMLElement>(basketTemplate);

            // Создаем экземпляр корзины и сохраняем ссылку
            this.currentBasket = new Basket(basketElement, {
                onCheckout: () => {
                    console.log('💳 Нажата кнопка оформления');
                    this.openOrderForm();
                }
            });

            this.updateBasketContent();
            this.modal.render({ content: basketElement });
            this.modal.open();

            console.log('✅ Корзина открыта');
        } catch (error) {
            console.error('❌ Ошибка открытия корзины:', error);
            this.isBasketOpen = false;
            this.currentBasket = null;
        }
    }

    private updateBasketContent() {
        if (!this.currentBasket) return;

        const items = this.basketModel.getItems();
        const total = this.basketModel.getTotalPrice();

        console.log(`📊 Обновление корзины: ${items.length} товаров на сумму ${total}`);

        if (items.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.className = 'basket__empty';
            this.currentBasket.items = [emptyMessage];
            this.currentBasket.buttonDisabled = true;
            console.log('📭 Корзина пуста');
        } else {
            const basketItems: HTMLElement[] = [];

            items.forEach((item, index) => {
                const itemElement = this.createBasketItem(item, index + 1);
                basketItems.push(itemElement);
            });

            this.currentBasket.items = basketItems;
            this.currentBasket.buttonDisabled = false;
            console.log(`📋 Показано ${items.length} товаров`);
        }

        this.currentBasket.total = total;
    }

    private createBasketItem(product: IProduct, index: number): HTMLElement {
        try {
            const template = ensureElement<HTMLTemplateElement>('#card-basket');
            const item = cloneTemplate<HTMLElement>(template);

            // Находим элементы внутри item
            const title = item.querySelector('.card__title');
            const price = item.querySelector('.card__price');
            const indexElement = item.querySelector('.basket__item-index');
            const deleteButton = item.querySelector('.basket__item-delete');

            // Заполняем данные
            if (title) title.textContent = product.title;

            if (price) {
                price.textContent = product.price !== null ?
                    `${product.price} синапсов` : 'Бесценно';
            }

            if (indexElement) indexElement.textContent = index.toString();

            // Добавляем обработчик удаления
            if (deleteButton) {
                // Фиксируем обработчик для правильного удаления
                const handleDelete = (event: Event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    console.log(`🗑️ Удаляем: ${product.title}`);
                    this.basketModel.removeItem(product.id);
                };

                deleteButton.addEventListener('click', handleDelete);
            }

            return item;
        } catch (error) {
            console.error(`❌ Ошибка при создании элемента для ${product.title}:`, error);

            // Запасной вариант
            return this.createSimpleBasketItem(product, index);
        }
    }

    private createSimpleBasketItem(product: IProduct, index: number): HTMLElement {
        const li = document.createElement('li');
        li.className = 'basket__item card card_compact';
        li.innerHTML = `
            <span class="basket__item-index">${index}</span>
            <span class="card__title">${product.title}</span>
            <span class="card__price">${product.price !== null ? product.price + ' синапсов' : 'Бесценно'}</span>
            <button class="basket__item-delete card__button" aria-label="удалить">×</button>
        `;

        const deleteBtn = li.querySelector('.basket__item-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.basketModel.removeItem(product.id);
            });
        }

        return li;
    }

    private updateBasketCounter() {
        const count = this.basketModel.getItemsCount();
        this.page.basketCounter = count;
        console.log(`🔢 Счетчик корзины обновлен: ${count}`);
    }

    private openOrderForm() {
        console.log('📄 Открываем форму заказа');

        // Сбрасываем флаг корзины
        this.isBasketOpen = false;
        this.currentBasket = null;

        try {
            // Создаем форму заказа один раз
            if (!this.orderForm) {
                const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
                const orderElement = cloneTemplate<HTMLElement>(orderTemplate);

                this.orderForm = new Order(orderElement, {
                    onClick: (event: MouseEvent) => {
                        this.handlePaymentSelect(event);
                    },
                    onSubmit: (event: SubmitEvent) => {
                        event.preventDefault();
                        this.proceedToContacts();
                    }
                });

                // Добавляем обработчик изменений формы
                this.orderForm.container.addEventListener('change', () => {
                    this.validateOrderForm();
                });
            }

            // Заполняем сохраненными данными
            const buyerData = this.buyerModel.getData();
            this.orderForm.render(buyerData);

            // Проверяем валидность
            this.validateOrderForm();

            this.modal.render({ content: this.orderForm.container });
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
                if (btn === button) {
                    btn.classList.add('button_alt-active');
                } else {
                    btn.classList.remove('button_alt-active');
                }
            });

            // Триггерим событие изменения
            if (this.orderForm) {
                this.orderForm.container.dispatchEvent(new Event('change'));
            }
        }
    }

    private validateOrderForm() {
        if (!this.orderForm) return;

        // Получаем текущие данные из формы
        const payment = this.orderForm.payment;
        const address = this.orderForm.address;

        // Обновляем модель
        if (payment !== null) {
            this.buyerModel.setData({ payment });
        }
        if (address.trim() !== '') {
            this.buyerModel.setData({ address });
        }

        const buyerData = this.buyerModel.getData();

        // Проверяем валидность
        const hasPayment = buyerData.payment !== null;
        const hasAddress = buyerData.address.trim() !== '';
        const isValid = hasPayment && hasAddress;

        this.orderForm.buttonDisabled = !isValid;

        if (!isValid) {
            const errors = [];
            if (!hasPayment) errors.push('Выберите способ оплаты');
            if (!hasAddress) errors.push('Введите адрес доставки');
            this.orderForm.errors = errors.join(', ');
        } else {
            this.orderForm.errors = '';
        }

        console.log('Валидация формы заказа:', {
            payment: buyerData.payment,
            address: buyerData.address,
            isValid
        });
    }

    private proceedToContacts() {
        console.log('➡️ Переход к форме контактов');

        // Проверяем данные перед переходом
        const buyerData = this.buyerModel.getData();
        const errors: string[] = [];

        if (!buyerData.payment) {
            errors.push('Выберите способ оплаты');
        }

        if (!buyerData.address.trim()) {
            errors.push('Введите адрес доставки');
        }

        if (errors.length > 0) {
            console.log('Ошибки первого шага:', errors);
            if (this.orderForm) {
                this.orderForm.errors = errors.join(', ');
            }
            return;
        }

        console.log('✅ Первый шаг пройден, открываем форму контактов');
        this.openContactsForm();
    }

    private openContactsForm() {
        console.log('📞 Открываем форму контактов');

        try {
            // Создаем форму контактов один раз
            if (!this.contactsForm) {
                const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
                const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);

                this.contactsForm = new Contacts(contactsElement, {
                    onSubmit: (event: SubmitEvent) => {
                        event.preventDefault();
                        this.submitOrder();
                    }
                });

                // Добавляем обработчик изменений формы
                this.contactsForm.container.addEventListener('change', () => {
                    this.validateContactsForm();
                });
            }

            // Заполняем сохраненными данными
            const buyerData = this.buyerModel.getData();
            this.contactsForm.render(buyerData);

            // Проверяем валидность
            this.validateContactsForm();

            this.modal.render({ content: this.contactsForm.container });
            this.modal.open();

            console.log('✅ Форма контактов открыта');
        } catch (error) {
            console.error('❌ Ошибка открытия формы контактов:', error);
        }
    }

    private validateContactsForm() {
        if (!this.contactsForm) return;

        // Обновляем данные модели из формы
        this.buyerModel.setData({
            email: this.contactsForm.email,
            phone: this.contactsForm.phone
        });

        const validation = this.buyerModel.validate();
        this.contactsForm.buttonDisabled = !validation.isValid;

        if (!validation.isValid) {
            const errors = Object.values(validation.errors).filter(Boolean).join(', ');
            this.contactsForm.errors = errors;
        } else {
            this.contactsForm.errors = '';
        }

        console.log('Валидация формы контактов:', {
            email: this.contactsForm.email,
            phone: this.contactsForm.phone,
            isValid: validation.isValid
        });
    }

    private async submitOrder() {
        console.log('🚀 Отправка заказа');

        try {
            const buyerData = this.buyerModel.getData();
            const items = this.basketModel.getItems();

            // Финальная проверка
            const validation = this.buyerModel.validate();
            if (!validation.isValid) {
                console.log('Ошибки валидации:', validation.errors);
                if (this.contactsForm) {
                    const errors = Object.values(validation.errors).filter(Boolean).join(', ');
                    this.contactsForm.errors = errors;
                }
                return;
            }

            if (items.length === 0) {
                console.error('Корзина пуста');
                this.showError('Корзина пуста!');
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
            this.showError('Ошибка оформления заказа. Попробуйте еще раз.');
        }
    }

    private showError(message: string) {
        if (this.contactsForm) {
            this.contactsForm.errors = message;
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