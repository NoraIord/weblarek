import './scss/styles.scss';

import { Api } from './components/base/api';
import { ShopApi } from './components/api/shop-api'; // ДОБАВЛЯЕМ
import { ProductModel } from './components/models/product-model';
import { BasketModel } from './components/models/basket-model';
import { BuyerModel } from './components/models/buyer-model'; // ДОБАВЛЯЕМ
import { CatalogPresenter } from './components/presenters/catalog-presenter';
import { API_URL } from './utils/constants';

console.log('🔍 Проверка DOM элементов:');
console.log('Modal container:', document.getElementById('modal-container'));
console.log('Order template:', document.getElementById('order'));
console.log('Contacts template:', document.getElementById('contacts'));
console.log('Basket template:', document.getElementById('basket'));
console.log('Gallery:', document.querySelector('.gallery'));

// Ожидаем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM полностью загружен');
    console.log('🔍 Проверка DOM после загрузки:');
    console.log('Modal container:', document.getElementById('modal-container'));
    console.log('Order template:', document.getElementById('order'));

    initApp();
});

async function initApp() {
    try {
        console.log('🚀 Starting app...');

        // Инициализация
        const productModel = new ProductModel();
        const basketModel = new BasketModel();
        const buyerModel = new BuyerModel();
        const api = new Api(API_URL);
        const shopApi = new ShopApi(api);

        const catalogPresenter = new CatalogPresenter(
            productModel,
            basketModel,
            buyerModel,
            shopApi
        );

        // Загрузка товаров
        const products = await shopApi.getProductList();
        productModel.setItems(products);

        // Отображение каталога
        catalogPresenter.renderCatalog();

        // Настраиваем кнопку корзины в шапке
        catalogPresenter.setupBasketButton();

        console.log('✅ App started');

    } catch (error) {
        console.error('❌ App error:', error);
    }
}


// Убираем прямой вызов initApp()
// initApp();