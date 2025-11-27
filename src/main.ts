// src/main.ts

import './scss/styles.scss';

import { ProductModel } from './components/models/product-model';
import { BasketModel } from './components/models/basket-model';
import { BuyerModel } from './components/models/buyer-model';
import { Api } from './components/base/api';
import { ShopApi } from './components/api/shop-api';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, TPayment } from './types';

// Простая функция для отображения товаров
function renderProducts(products: IProduct[]) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'gallery__item card';
        productElement.innerHTML = `
            <span class="card__category">${product.category}</span>
            <h2 class="card__title">${product.title}</h2>
            <img class="card__image" src="${CDN_URL}${product.image}" alt="${product.title}" />
            <span class="card__price">${product.price ? product.price + ' синапсов' : 'Бесценно'}</span>
        `;
        gallery.appendChild(productElement);
    });
}

// Функция для обновления счетчика корзины
function updateBasketCounter(count: number) {
    const basketCounter = document.querySelector('.header__basket-counter');
    if (basketCounter) {
        basketCounter.textContent = count.toString();
    }
}

async function testModels() {
    console.log('🧪 Тестирование моделей данных...');

    // Тестирование ProductModel
    console.log('\n📦 Тестирование ProductModel:');
    const productModel = new ProductModel();

    const testProducts: IProduct[] = [
        {
            id: '1',
            title: 'Тестовый товар 1',
            description: 'Описание товара 1',
            image: '/image1.jpg',
            category: 'софт-скил',
            price: 1000
        },
        {
            id: '2',
            title: 'Тестовый товар 2',
            description: 'Описание товара 2',
            image: '/image2.jpg',
            category: 'хард-скил',
            price: 2000
        }
    ];

    // Тест 1: Установка и получение товаров
    console.log('🧪 Тест 1: Установка товаров');
    productModel.setItems(testProducts);
    const allProducts = productModel.getItems();
    console.log('✅ Установлены товары:', allProducts);

    // ОТОБРАЖАЕМ ТОВАРЫ НА СТРАНИЦЕ
    renderProducts(allProducts);

    // Тестирование BasketModel
    console.log('\n🛒 Тестирование BasketModel:');
    const basketModel = new BasketModel();

    // Тест 1: Добавление товаров
    console.log('🧪 Тест 1: Добавление товаров в корзину');
    basketModel.addItem(testProducts[0]);
    basketModel.addItem(testProducts[1]);
    const basketItems = basketModel.getItems();
    console.log('✅ Товары в корзине:', basketItems);

    // ОБНОВЛЯЕМ СЧЕТЧИК КОРЗИНЫ
    updateBasketCounter(basketModel.getItemsCount());

    // Тестирование BuyerModel
    console.log('\n👤 Тестирование BuyerModel:');
    const buyerModel = new BuyerModel();

    // Тест 1: Полное заполнение данных
    console.log('🧪 Тест 1: Полное заполнение данных');
    buyerModel.setData({
        payment: 'online' as TPayment,
        email: 'test@example.com',
        phone: '+79991234567',
        address: 'Тестовый адрес'
    });
    const dataWithPayment = buyerModel.getData();
    console.log('✅ Данные покупателя:', dataWithPayment);

    // Тестирование API
    console.log('\n🌐 Тестирование API:');
    try {
        const api = new Api(API_URL);
        const shopApi = new ShopApi(api);

        console.log('🧪 Загрузка товаров с сервера...');
        const productsFromApi = await shopApi.getProductList();
        console.log('✅ Товары с сервера:', productsFromApi);

        // ОБНОВЛЯЕМ ТОВАРЫ НА СТРАНИЦЕ РЕАЛЬНЫМИ ДАННЫМИ
        productModel.setItems(productsFromApi);
        renderProducts(productsFromApi);

    } catch (error) {
        console.error('❌ Ошибка API:', error);
    }

    console.log('\n🎉 Все тесты завершены!');
}

// Запускаем тесты после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Запуск тестирования моделей данных...');
    testModels().catch(error => {
        console.error('❌ Ошибка при запуске тестов:', error);
    });
});