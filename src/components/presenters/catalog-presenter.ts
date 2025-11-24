import { ProductModel } from '../models/product-model';
import { BasketModel } from '../models/basket-model';
import { BuyerModel } from '../models/buyer-model'; // ДОБАВЛЯЕМ
import { ShopApi } from '../api/shop-api'; // ДОБАВЛЯЕМ
import { CardView } from '../views/card-view';
import { CardPreviewView } from '../views/card-preview-view';
import { BasketView } from '../views/basket-view';
import { OrderPresenter } from './order-presenter'; // ДОБАВЛЯЕМ
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class CatalogPresenter {
    private basketView: BasketView;
    private orderPresenter: OrderPresenter;

    constructor(
        private productModel: ProductModel,
        private basketModel: BasketModel,
        buyerModel: BuyerModel,
        shopApi: ShopApi
    ) {
        this.basketView = this.initializeBasket();
        this.orderPresenter = new OrderPresenter(basketModel, buyerModel, shopApi);
    }

    private initializeBasket(): BasketView {
        const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
        const basketElement = cloneTemplate<HTMLElement>(basketTemplate);

        return new BasketView(basketElement, {
            onCheckout: () => this.handleCheckout(),
            onRemove: (index: number) => this.handleRemoveItem(index)
        });
    }

    renderCatalog(): void {
        const gallery = ensureElement<HTMLElement>('.gallery');
        const products = this.productModel.getItems();

        gallery.innerHTML = '';

        products.forEach(product => {
            const template = ensureElement<HTMLTemplateElement>('#card-catalog');
            const element = cloneTemplate<HTMLElement>(template);

            const card = new CardView(element, {
                onClick: () => this.handleCardClick(product)
            });

            card.render({
                id: product.id,
                title: product.title,
                image: `${CDN_URL}${product.image}`,
                category: product.category,
                price: product.price,
                description: product.description
            });

            gallery.appendChild(element);
        });

        this.updateBasketCounter();
    }

    // ОТКРЫТИЕ КОРЗИНЫ ПРИ КЛИКЕ НА ИКОНКУ В ШАПКЕ
    setupBasketButton(): void {
        const basketButton = document.querySelector('.header__basket');
        if (basketButton) {
            basketButton.addEventListener('click', () => {
                this.openBasketModal();
            });
        }
    }

    private handleCardClick(product: IProduct): void {
        this.openProductModal(product);
    }

    private openProductModal(product: IProduct): void {
        const modalContainer = ensureElement<HTMLElement>('#modal-container');
        const modalContent = ensureElement<HTMLElement>('.modal__content', modalContainer);

        const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
        const previewElement = cloneTemplate<HTMLElement>(previewTemplate);

        const previewView = new CardPreviewView(previewElement, {
            onAddToBasket: (product) => this.handleAddToBasket(product)
        });

        previewView.render({
            id: product.id,
            title: product.title,
            image: `${CDN_URL}${product.image}`,
            category: product.category,
            price: product.price,
            description: product.description
        });

        modalContent.innerHTML = '';
        modalContent.appendChild(previewElement);
        modalContainer.classList.add('modal_active');
        this.setupModalClose(modalContainer);
    }

    // ОТКРЫТИЕ МОДАЛЬНОГО ОКНА КОРЗИНЫ
    private openBasketModal(): void {
        const modalContainer = ensureElement<HTMLElement>('#modal-container');
        const modalContent = ensureElement<HTMLElement>('.modal__content', modalContainer);

        // Обновляем данные корзины
        this.updateBasketView();

        modalContent.innerHTML = '';
        modalContent.appendChild(this.basketView.render());
        modalContainer.classList.add('modal_active');
        this.setupModalClose(modalContainer);
    }

    private handleAddToBasket(product: IProduct): void {
        if (product.price !== null) {
            this.basketModel.addItem(product);
            console.log('➕ Товар добавлен в корзину:', product.title);
            this.updateBasketCounter();
            this.closeModal();
        } else {
            console.log('❌ Этот товар нельзя добавить в корзину');
        }
    }

    // УДАЛЕНИЕ ТОВАРА ИЗ КОРЗИНЫ ПО basketId
    private handleRemoveItem(index: number): void {
        this.basketModel.removeItemByIndex(index);
        console.log('🗑️ Удален товар с индексом:', index);
        this.updateBasketView();
        this.updateBasketCounter();
    }

    // ОБНОВЛЕНИЕ ВИДА КОРЗИНЫ
    private updateBasketView(): void {
        const items = this.basketModel.getItems();
        const basketItems = items.map((item, index) => ({
            id: item.product.id,
            index: index + 1,
            title: item.product.title,
            price: item.product.price || 0,
            quantity: item.quantity
        }));

        this.basketView.items = basketItems;
        this.basketView.total = this.basketModel.getTotalPrice();
    }


    private updateBasketCounter(): void {
        const basketCounter = document.querySelector('.header__basket-counter');
        if (basketCounter) {
            const count = this.basketModel.getItemsCount();
            basketCounter.textContent = count.toString();
        }
    }

    private closeModal(): void {
        console.log('🔒 CatalogPresenter: Закрываем модальное окно');
        const modalContainer = ensureElement<HTMLElement>('#modal-container');
        modalContainer.classList.remove('modal_active');
    }

    private setupModalClose(modalContainer: HTMLElement): void {
        const closeButton = ensureElement<HTMLButtonElement>('.modal__close', modalContainer);

        const closeHandler = () => {
            this.closeModal();
            closeButton.removeEventListener('click', closeHandler);
            modalContainer.removeEventListener('click', overlayHandler);
        };

        const overlayHandler = (event: MouseEvent) => {
            if (event.target === modalContainer) {
                closeHandler();
            }
        };

        closeButton.addEventListener('click', closeHandler);
        modalContainer.addEventListener('click', overlayHandler);
    }

    private handleCheckout(): void {
        const itemsCount = this.basketModel.getItemsCount();

        console.log('🛒 handleCheckout вызван, товаров в корзине:', itemsCount);

        if (itemsCount === 0) {
            console.log('❌ Корзина пуста - оформление невозможно');
            return;
        }

        console.log('🚀 Вызываем orderPresenter.startOrder()');

        // УБИРАЕМ закрытие модального окна - OrderPresenter сам будет управлять им
        // this.closeModal(); // ❌ КОММЕНТИРУЕМ ЭТУ СТРОКУ

        try {
            this.orderPresenter.startOrder();
            console.log('✅ orderPresenter.startOrder() выполнен успешно');
        } catch (error) {
            console.error('❌ Ошибка в orderPresenter.startOrder():', error);
        }
    }
}