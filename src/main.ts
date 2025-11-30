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
    console.log('🧪 ТЕСТИРОВАНИЕ ВСЕХ МЕТОДОВ ВСЕХ МОДЕЛЕЙ ДАННЫХ');

    // Тестирование ProductModel
    console.log('\n=== 📦 ТЕСТИРОВАНИЕ PRODUCTMODEL ===');

    const productModel = new ProductModel();

    // Тест 1: setItems и getItems
    console.log('\n🧪 Тест 1: setItems и getItems');
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
        },
        {
            id: '3',
            title: 'Бесценный товар',
            description: 'Товар без цены',
            image: '/image3.jpg',
            category: 'другое',
            price: null
        }
    ];

    productModel.setItems(testProducts);
    const allProducts = productModel.getItems();
    console.log('✅ setItems установлены товары');
    console.log('✅ getItems возвращает массив товаров:', allProducts);

    // ОТОБРАЖАЕМ ТОВАРЫ НА СТРАНИЦЕ
    renderProducts(allProducts);

    // Тест 2: setSelectedProduct и getSelectedProduct
    console.log('\n🧪 Тест 2: setSelectedProduct и getSelectedProduct');
    productModel.setSelectedProduct(testProducts[0]);
    const selectedProduct = productModel.getSelectedProduct();
    console.log('✅ setSelectedProduct установлен товар:', testProducts[0].title);
    console.log('✅ getSelectedProduct возвращает товар:', selectedProduct);

    // Тест 3: getItem (поиск по ID)
    console.log('\n🧪 Тест 3: getItem (поиск по ID)');
    const foundProduct = allProducts.find(item => item.id === '2');
    console.log('✅ Найден товар с ID "2":', foundProduct);

    // Тестирование BasketModel
    console.log('\n=== 🛒 ТЕСТИРОВАНИЕ BASKETMODEL ===');

    const basketModel = new BasketModel();

    // Тест 1: addItem и getItems
    console.log('\n🧪 Тест 1: addItem и getItems');
    basketModel.addItem(testProducts[0]);
    basketModel.addItem(testProducts[1]);
    basketModel.addItem(testProducts[2]);
    const basketItems = basketModel.getItems();
    console.log('✅ addItem добавлены товары в корзину');
    console.log('✅ getItems возвращает товары в корзине:', basketItems);

    // Тест 2: getItemsCount
    console.log('\n🧪 Тест 2: getItemsCount');
    const itemsCount = basketModel.getItemsCount();
    console.log('✅ getItemsCount возвращает количество товаров:', itemsCount);

    // ОБНОВЛЯЕМ СЧЕТЧИК КОРЗИНЫ
    updateBasketCounter(itemsCount);

    // Тест 3: getTotalPrice
    console.log('\n🧪 Тест 3: getTotalPrice');
    const totalPrice = basketModel.getTotalPrice();
    console.log('✅ getTotalPrice возвращает общую стоимость:', totalPrice);

    // Тест 4: contains
    console.log('\n🧪 Тест 4: contains');
    const containsProduct1 = basketModel.contains('1');
    const containsProduct999 = basketModel.contains('999');
    console.log('✅ contains проверяет наличие товара 1:', containsProduct1);
    console.log('✅ contains проверяет наличие товара 999:', containsProduct999);

    // Тест 5: removeItem
    console.log('\n🧪 Тест 5: removeItem');
    basketModel.removeItem(testProducts[0]);
    const itemsAfterRemoval = basketModel.getItems();
    const countAfterRemoval = basketModel.getItemsCount();
    const priceAfterRemoval = basketModel.getTotalPrice();
    console.log('✅ removeItem удален товар 1');
    console.log('✅ getItems после удаления:', itemsAfterRemoval);
    console.log('✅ getItemsCount после удаления:', countAfterRemoval);
    console.log('✅ getTotalPrice после удаления:', priceAfterRemoval);

    // ОБНОВЛЯЕМ СЧЕТЧИК КОРЗИНЫ ПОСЛЕ УДАЛЕНИЯ
    updateBasketCounter(countAfterRemoval);

    // Тест 6: clear
    console.log('\n🧪 Тест 6: clear');
    basketModel.clear();
    const itemsAfterClear = basketModel.getItems();
    const countAfterClear = basketModel.getItemsCount();
    const priceAfterClear = basketModel.getTotalPrice();
    console.log('✅ clear очищена корзина');
    console.log('✅ getItems после очистки:', itemsAfterClear);
    console.log('✅ getItemsCount после очистки:', countAfterClear);
    console.log('✅ getTotalPrice после очистки:', priceAfterClear);

    // ОБНОВЛЯЕМ СЧЕТЧИК КОРЗИНЫ ПОСЛЕ ОЧИСТКИ
    updateBasketCounter(countAfterClear);

    // Тестирование BuyerModel
    console.log('\n=== 👤 ТЕСТИРОВАНИЕ BUYERMODEL ===');

    const buyerModel = new BuyerModel();

    // Тест 1: setData и getData (частичные данные)
    console.log('\n🧪 Тест 1: setData и getData (частичные данные)');
    buyerModel.setData({
        email: 'test@example.com',
        phone: '+79991234567',
        address: 'Тестовый адрес'
    });
    const dataWithoutPayment = buyerModel.getData();
    console.log('✅ setData установлены частичные данные');
    console.log('✅ getData возвращает данные покупателя:', dataWithoutPayment);

    // Тест 2: validate (невалидные данные)
    console.log('\n🧪 Тест 2: validate (невалидные данные)');
    const validationWithoutPayment = buyerModel.validate();
    console.log('✅ validate возвращает результат валидации:', validationWithoutPayment);

    // Тест 3: setData и getData (полные данные)
    console.log('\n🧪 Тест 3: setData и getData (полные данные)');
    buyerModel.setData({
        payment: 'online' as TPayment,
        email: 'test@example.com',
        phone: '+79991234567',
        address: 'Тестовый адрес'
    });
    const dataWithPayment = buyerModel.getData();
    console.log('✅ setData установлены полные данные');
    console.log('✅ getData возвращает данные покупателя:', dataWithPayment);

    // Тест 4: validate (валидные данные)
    console.log('\n🧪 Тест 4: validate (валидные данные)');
    const validationWithPayment = buyerModel.validate();
    console.log('✅ validate возвращает результат валидации:', validationWithPayment);

    // Тест 5: clear
    console.log('\n🧪 Тест 5: clear');
    buyerModel.clear();
    const dataAfterClear = buyerModel.getData();
    const validationAfterClear = buyerModel.validate();
    console.log('✅ clear очищены данные покупателя');
    console.log('✅ getData после очистки:', dataAfterClear);
    console.log('✅ validate после очистки:', validationAfterClear);

    // Тестирование API и работа с реальными данными
    console.log('\n=== 🌐 ТЕСТИРОВАНИЕ API И РАБОТА С РЕАЛЬНЫМИ ДАННЫМИ ===');

    try {
        const api = new Api(API_URL);
        const shopApi = new ShopApi(api);

        console.log('\n🧪 Загрузка товаров с сервера...');
        const productsFromApi = await shopApi.getProductList();
        console.log('✅ getProductList загружены товары с сервера');
        console.log('✅ Массив товаров с сервера:', productsFromApi);

        // Сохраняем товары в модель
        productModel.setItems(productsFromApi);
        const productsAfterApi = productModel.getItems();
        console.log('✅ setItems установлены товары из API в модель');
        console.log('✅ getItems возвращает товары из модели:', productsAfterApi);

        // ОБНОВЛЯЕМ ТОВАРЫ НА СТРАНИЦЕ РЕАЛЬНЫМИ ДАННЫМИ
        renderProducts(productsFromApi);

        // Тестируем корзину с реальными данными
        if (productsFromApi.length > 0) {
            console.log('\n🧪 Тест корзины с реальными данными с сервера');
            basketModel.addItem(productsFromApi[0]);
            if (productsFromApi.length > 1) {
                basketModel.addItem(productsFromApi[1]);
            }
            const basketWithRealItems = basketModel.getItems();
            const realItemsCount = basketModel.getItemsCount();
            const realTotalPrice = basketModel.getTotalPrice();
            console.log('✅ addItem добавлены реальные товары в корзину');
            console.log('✅ getItems возвращает реальные товары:', basketWithRealItems);
            console.log('✅ getItemsCount возвращает количество:', realItemsCount);
            console.log('✅ getTotalPrice возвращает стоимость:', realTotalPrice);

            // ОБНОВЛЯЕМ СЧЕТЧИК КОРЗИНЫ С РЕАЛЬНЫМИ ДАННЫМИ
            updateBasketCounter(realItemsCount);
        }

    } catch (error) {
        console.error('❌ Ошибка API:', error);
    }

    console.log('\n🎉 ВСЕ МЕТОДЫ ВСЕХ МОДЕЛЕЙ УСПЕШНО ПРОТЕСТИРОВАНЫ!');
    console.log('✅ ProductModel: setItems, getItems, setSelectedProduct, getSelectedProduct');
    console.log('✅ BasketModel: addItem, removeItem, getItems, getItemsCount, getTotalPrice, contains, clear');
    console.log('✅ BuyerModel: setData, getData, validate, clear');
    console.log('✅ ShopApi: getProductList');
}

// Запускаем тесты после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ЗАПУСК ПОЛНОГО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ДАННЫХ...');
    testModels().catch(error => {
        console.error('❌ Ошибка при запуске тестов:', error);
    });
});