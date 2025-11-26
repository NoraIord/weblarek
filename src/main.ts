// src/main.ts

import './scss/styles.scss';

import { ProductModel } from './components/models/product-model';
import { BasketModel } from './components/models/basket-model';
import { BuyerModel } from './components/models/buyer-model';
import { Api } from './components/base/api';
import { ShopApi } from './components/api/shop-api';
import { API_URL } from './utils/constants';
import { IProduct, IBuyer, TPayment } from './types';

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

    productModel.setItems(testProducts);
    console.log('✅ Установлены товары:', productModel.getItems());

    productModel.setSelectedProduct(testProducts[0]);
    console.log('✅ Выбран товар:', productModel.getSelectedProduct());

    // Тестирование BasketModel
    console.log('\n🛒 Тестирование BasketModel:');
    const basketModel = new BasketModel();

    basketModel.addItem(testProducts[0]);
    basketModel.addItem(testProducts[1]);
    console.log('✅ Товары в корзине:', basketModel.getItems());
    console.log('✅ Количество товаров:', basketModel.getItemsCount());
    console.log('✅ Общая стоимость:', basketModel.getTotalPrice());
    console.log('✅ Содержит товар 1:', basketModel.contains('1'));

    basketModel.removeItem(testProducts[0]);
    console.log('✅ После удаления товара 1:', basketModel.getItems());

    basketModel.clear();
    console.log('✅ После очистки:', basketModel.getItems());

    // Тестирование BuyerModel
    console.log('\n👤 Тестирование BuyerModel:');
    const buyerModel = new BuyerModel();

    const buyerData: Partial<IBuyer> = {
        payment: 'online' as TPayment,
        email: 'test@example.com',
        phone: '+79991234567',
        address: 'Тестовый адрес'
    };

    buyerModel.setData(buyerData);
    console.log('✅ Данные покупателя:', buyerModel.getData());

    const validation = buyerModel.validate();
    console.log('✅ Валидация данных:', validation);

    buyerModel.clear();
    console.log('✅ После очистки:', buyerModel.getData());
    console.log('✅ Валидация пустых данных:', buyerModel.validate());

    // Тестирование API
    console.log('\n🌐 Тестирование API:');
    try {
        const api = new Api(API_URL);
        const shopApi = new ShopApi(api);

        const products = await shopApi.getProductList();
        console.log('✅ Товары с сервера:', products);

        // Сохраняем товары в модель для демонстрации
        productModel.setItems(products);
        console.log('✅ Товары в модели после API:', productModel.getItems());

    } catch (error) {
        console.error('❌ Ошибка API:', error);
    }
}

// Запускаем тесты после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    testModels();
});