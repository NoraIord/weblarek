// src/main.ts

import './scss/styles.scss';

import { Api } from './components/base/api';
import { ShopApi } from './components/api/shop-api';
import { ProductModel } from './components/models/product-model';
import { BasketModel } from './components/models/basket-model';
import { BuyerModel } from './components/models/buyer-model';
import { CatalogPresenter } from './components/presenters/catalog-presenter';
import { API_URL } from './utils/constants';
import { IApi } from './types';

async function initApp() {
    try {
        console.log('🚀 Starting app...');

        // ПРОВЕРКА DOM ПЕРЕД ИНИЦИАЛИЗАЦИЕЙ
        console.log('🔍 Проверка DOM элементов:');
        console.log('Modal container:', document.getElementById('modal-container'));
        console.log('Order template:', document.getElementById('order'));
        console.log('Contacts template:', document.getElementById('contacts'));
        console.log('Basket template:', document.getElementById('basket'));
        console.log('Gallery:', document.querySelector('.gallery'));

        // Инициализация моделей
        const productModel = new ProductModel();
        const basketModel = new BasketModel();
        const buyerModel = new BuyerModel();

        // Инициализация API с использованием интерфейса IApi
        const api: IApi = new Api(API_URL);
        const shopApi = new ShopApi(api);

        // Инициализация презентера
        const catalogPresenter = new CatalogPresenter(
            productModel,
            basketModel,
            buyerModel,
            shopApi
        );

        // Загрузка товаров
        console.log('📦 Загружаем товары с сервера...');
        const products = await shopApi.getProductList();
        productModel.setItems(products);
        console.log(`✅ Загружено ${products.length} товаров`);

        // Отображение каталога
        console.log('🎨 Отображаем каталог...');
        catalogPresenter.renderCatalog();

        // Настраиваем кнопку корзины в шапке
        console.log('🛒 Настраиваем кнопку корзины...');
        catalogPresenter.setupBasketButton();

        console.log('✅ App started successfully');

    } catch (error) {
        console.error('❌ App error:', error);

        // Показываем сообщение об ошибке пользователю
        const gallery = document.querySelector('.gallery');
        if (gallery) {
            gallery.innerHTML = `
                <div class="error-message">
                    <h2>Ошибка загрузки приложения</h2>
                    <p>Пожалуйста, обновите страницу или попробуйте позже</p>
                </div>
            `;
        }
    }
}

// Ожидаем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM полностью загружен');
    console.log('🔍 Проверка DOM после загрузки:');
    console.log('Modal container:', document.getElementById('modal-container'));
    console.log('Order template:', document.getElementById('order'));

    initApp();
});

// Добавляем обработчик ошибок для неперехваченных исключений
window.addEventListener('error', (event) => {
    console.error('❌ Unhandled error:', event.error);
});

// Добавляем обработчик для отклоненных промисов
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
});