# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

## Структура проекта:
- `src/` — исходные файлы проекта
- `src/components/` — папка с JS компонентами
- `src/components/base/` — папка с базовым кодом
- `src/components/models/` — папка с моделями данных
- `src/components/api/` — папка с API классами

## Важные файлы:
- `index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/main.ts` — точка входа приложения (тестирование моделей)
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды:


```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```

**Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков. Проект реализует полный цикл покупки от выбора товара до оформления заказа.

**Архитектура приложения
Проект построен на основе модульного подхода с четким разделением ответственности между компонентами.

**Базовый код
Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:
`constructor(baseUrl: string) `- в конструктор передается базовый адрес сервера

Поля класса:
`baseUrl: string `- базовый адрес сервера

Методы:

`get<T>(uri: string): Promise<T> - выполняет GET запрос`

`post<T>(uri: string, data: object): Promise<T> - выполняет POST запрос`

Класс EventEmitter
Реализует систему событий для коммуникации между компонентами.

Методы:

`on<T>(eventName: EventName, callback: (event: T) => void) - подписка на событие`

`emit<T>(eventName: string, data?: T) - генерация события`

`off(eventName: EventName, callback: Subscriber) - отписка от события`

`onAll(callback: (event: EmitterEvent) => void) - подписка на все события`

🎭 Взаимодействие компонентов
Диаграмма потока данных

┌─────────────┐    События    ┌─────────────┐    Изменения    ┌─────────────┐
│    View     │ ────────────> │  Presenter  │ ────────────> │    Model    │
│  (отображение)│              │   (App)     │              │   (данные)   │
└─────────────┘               └─────────────┘               └─────────────┘
        ▲                                                           │
        │                    Обновления                             │
        └───────────────────────────────────────────────────────────┘

🔧 Технический стек

Технология	Назначение
TypeScript	Типизированный JavaScript для надежности
Vite	Современный сборщик и dev-сервер
SCSS	Препроцессор для стилей
ES6+	Современные возможности JavaScript
Fetch API	Работа с HTTP-запросами

**Данные

Интерфейсы данных

Товар (IProduct)

`interface IProduct {
  id: string;           // Уникальный идентификатор товара
  description: string;  // Описание товара
  image: string;        // Путь к изображению товара
  title: string;        // Название товара
  category: string;     // Категория товара
  price: number | null; // Цена в синапсах (может быть null)
}`

Покупатель (IBuyer)

`interface IBuyer {
  payment: TPayment;    // Способ оплаты ('online' | 'offline')
  email: string;       // Email покупателя
  phone: string;       // Телефон покупателя
  address: string;     // Адрес доставки
}`

Заказ (IOrderData)

`interface IOrderData {
  payment: TPayment;    // Способ оплаты
  email: string;       // Email покупателя
  phone: string;       // Телефон покупателя
  address: string;     // Адрес доставки
  total: number;       // Общая сумма заказа
  items: string[];     // Массив ID товаров
}`

Модели данных
1. Каталог товаров (ProductModel)
Назначение: Управление данными каталога товаров.

Конструктор:
`constructor()`

Поля класса:

`items: IProduct[] - массив всех товаров каталога`

`selectedProduct: IProduct | null - выбранный для просмотра товар`

Методы:

`setItems(products: IProduct[]): void - сохраняет массив товаров`

`getItems(): IProduct[] - возвращает массив всех товаров`

`setSelectedProduct(product: IProduct): void - сохраняет товар для детального просмотра`

`getSelectedProduct(): IProduct | null - возвращает выбранный товар`

События:

`productModel:itemsChanged - при изменении списка товаров`

`productModel:selectedChanged - при изменении выбранного товара`

2. Корзина (BasketModel)
Назначение: Управление товарами в корзине покупок.

Конструктор:
`constructor()`

Поля класса:

`items: IProduct[] - массив товаров в корзине`

Методы:

`getItems(): IProduct[] - возвращает массив товаров в корзине`

`addItem(product: IProduct): void - добавляет товар в корзину`

`removeItem(productId: string): void - удаляет товар из корзины`

`clear(): void - очищает корзину`

`getTotalPrice(): number - возвращает общую стоимость товаров`

`getItemsCount(): number - возвращает количество товаров`

`contains(productId: string): boolean - проверяет наличие товара`

События:

`basketModel:changed - при изменении содержимого корзины`

3. Покупатель (BuyerModel)
Назначение: Хранение и валидация данных покупателя.

Конструктор:
`constructor()`

Поля класса:

`payment: TPayment | null - способ оплаты`

`email: string - email покупателя`

`phone: string - телефон покупателя`

`address: string - адрес доставки`

Методы:

`setData(data: Partial<IBuyer>): void - сохраняет данные покупателя`

`getData(): IBuyer - возвращает данные покупателя`

`clear(): void - очищает данные`

`validate(): IValidationResult - проверяет валидность данных`

События:

`buyerModel:changed - при изменении данных покупателя`

Валидация данных
Правила валидации полей покупателя:

`payment: должно быть выбрано значение ('online' или 'offline')`

`email: не пустая строка`

`phone: не пустая строка`

`address: не пустая строка`

Слой коммуникации
Класс ShopApi
Назначение: Обеспечивает взаимодействие с сервером API магазина.

Конструктор:
`constructor(api: IApi)`

Методы:

`getProductList(): Promise<IProduct[]> - получает список товаров с сервера`

`createOrder(order: IOrderData): Promise<IOrderResult> - отправляет заказ на сервер`

Endpoint:

`GET /product/ - получение товаров`

`POST /order/ - создание заказа`

🎯 Презентер (App)
Класс App
Центральный координатор приложения, обрабатывает все события и управляет состоянием.

Основные обязанности:

Инициализация всех компонентов

Настройка обработчиков событий

Координация взаимодействия Model ↔ View

Управление бизнес-логикой

Ключевые методы:

`initEventHandlers() - настройка обработчиков событий`

`loadProducts() - загрузка товаров с сервера`

`renderCatalog() - отображение каталога`

`openProductModal() - открытие модального окна товара`

`handleProductAction() - обработка действий с товаром`

`openBasket() - открытие корзины`

`createBasketItem() - создание элемента корзины`

`openOrderForm() - открытие формы заказа`

`handlePaymentSelect() - обработка выбора оплаты`

`proceedToContacts() - переход к форме контактов`

`openContactsForm() - открытие формы контактов`

`submitOrder() - отправка заказа`

`showSuccess() - отображение успешного оформления`

Документация слоя Представления (View)
Архитектура слоя View
Слой представления отвечает за отображение данных на странице и взаимодействие с пользователем. Все классы представления наследуются от базового класса Component<T>.

Базовый класс Component<T>
Назначение: Абстрактный базовый класс для всех компонентов представления.

Конструктор:

`constructor(container: HTMLElement)`
`container - DOM-элемент, в котором отображается компонент`

Методы:

`render(data?: Partial<T>): HTMLElement - обновляет данные компонента`

`setText(element: HTMLElement, value: string): void - устанавливает текст элемента`

`setImage(element: HTMLImageElement, src: string, alt?: string): void - устанавливает изображение`

`setDisabled(element: HTMLElement, state: boolean): void - управляет состоянием disabled`

`setVisible(element: HTMLElement, state: boolean): void - управляет видимостью элемента`

Классы карточек товаров
Card - универсальная карточка товара
Назначение: Отображение товара в разных контекстах (каталог, просмотр, корзина).

Свойства:

`protected _title: HTMLElement - элемент названия товара`

`protected _image: HTMLImageElement - элемент изображения`

`protected _category: HTMLElement - элемент категории`

`protected _price: HTMLElement - элемент цены`

`protected _button?: HTMLButtonElement - кнопка действия`

`protected _description?: HTMLElement - описание товара`

Методы:

`set title(value: string) - устанавливает название`

`set image(value: string) - устанавливает изображение`

`set category(value: string) - устанавливает категорию с CSS-классом`

`set price(value: number | null) - устанавливает цену`

`set description(value: string) - устанавливает описание`

`set buttonText(value: string) - устанавливает текст кнопки`

`set buttonDisabled(state: boolean) - управляет состоянием кнопки`

Типы использования:

Каталог (`#card-catalog`) - компактное отображение на главной

Просмотр (`#card-preview`) - детальное отображение в модальном окне

Корзина (`#card-basket`) - отображение в списке корзины

Особенности:

Автоматическое применение CSS-классов для категорий через `categoryMap`

Обработка товаров без цены ("Бесценно")

Динамическое изменение текста кнопки

Классы модальных окон
Modal - модальное окно
Назначение: Управление модальными окнами.

Свойства:

`protected _closeButton: HTMLButtonElement - кнопка закрытия`

`protected _content: HTMLElement - область содержимого`

Методы:

`open() - открывает модальное окно`

`close() - закрывает модальное окно`

`set content(value: HTMLElement) - устанавливает содержимое`

Особенности:

Закрытие по клику вне окна

Закрытие по кнопке Escape

Закрытие по крестику

Блокировка скролла страницы при открытии

Компоненты интерфейса
Basket - представление корзины
Назначение: Отображает содержимое корзины в модальном окне.

Шаблон:`#basket`

Свойства:

`protected _list: HTMLElement - список товаров`

`protected _total: HTMLElement - элемент общей суммы`

`protected _button: HTMLButtonElement - кнопка оформления`

Методы:

`set items(items: HTMLElement[]) - устанавливает список товаров`

`set total(total: number) - устанавливает общую сумму`

`set buttonDisabled(state: boolean) - управляет состоянием кнопки`

Особенности:

Автоматическая блокировка кнопки при пустой корзине

Отображение количества товаров

Удаление товаров по индексу

Order - формы оформления заказа
Назначение: Ввод данных покупателя.

Свойства:

`protected _button: HTMLButtonElement - кнопка отправки`

`protected _paymentButtons: NodeListOf<HTMLButtonElement> - кнопки выбора оплаты`

`protected _addressInput?: HTMLInputElement - поле адреса`

`protected _emailInput?: HTMLInputElement - поле email`

`protected _phoneInput?: HTMLInputElement - поле телефона`

`protected _errors: HTMLElement - отображение ошибок`

Методы:

`set payment(value: TPayment) - устанавливает способ оплаты`

`set address(value: string) - устанавливает адрес`

`set email(value: string) - устанавливает email`

`set phone(value: string) - устанавливает телефон`

`set buttonDisabled(state: boolean) - управляет состоянием кнопки`

`set errors(value: string) - отображает ошибки валидации`

Формы:

Первая форма (`#order`) - выбор оплаты и адрес

Вторая форма (`#contacts`) - email и телефон

Особенности:

Валидация в реальном времени

Визуальное выделение выбранного способа оплаты через класс `button_alt-active`

Управление состоянием кнопок отправки

Success - окно успешного оформления
Назначение: Отображение подтверждения заказа.

Шаблон: `#success`

Свойства:

`protected _total: HTMLElement - отображение суммы заказа`

`protected _button: HTMLButtonElement - кнопка закрытия`

Методы:

`set total(value: number) - устанавливает сумму заказа`

🎨 Стили и UI
Категории товаров
Каждая категория имеет свой цветовой код через categoryMap:

Категория 	      CSS-класс	                    Цвет
софт-скил	        `card__category_soft`	        Синий
хард-скил	        `card__category_hard`         Зеленый
кнопка	          `card__category_button`      	Желтый
дополнительное	  `card__category_additional`	  Фиолетовый
другое	          `card__category_other`        Серый

Константы

// API URL
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

// CDN URL для изображений
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

// Утилиты
export function ensureElement<T extends HTMLElement>(selector: string, parent?: HTMLElement): T;
export function cloneTemplate<T extends HTMLElement>(template: HTMLTemplateElement): T;


🔄 Поток данных
1. Загрузка приложения

`App инициализация → Загрузка товаров → ProductModel.setItems() → 
productModel:itemsChanged → renderCatalog()`

2. Добавление товара в корзину

`Клик по товару → openProductModal() → Клик "В корзину" → 
handleProductAction() → BasketModel.addItem() → 
basketModel:changed → updateBasketCounter() → Закрытие модального окна`

3. Оформление заказа

`Открытие корзины → Клик "Оформить" → openOrderForm() → 
Заполнение формы 1 → proceedToContacts() → 
Заполнение формы 2 → submitOrder() → 
API.createOrder() → showSuccess() → Очистка корзины`

🧪 Тестирование
Приложение включает автоматическое тестирование всех моделей:

Тесты ProductModel
Установка и получение списка товаров

Выбор и получение конкретного товара

Тесты BasketModel
Добавление товаров в корзину

Удаление товаров из корзины

Расчет общей стоимости

Проверка наличия товаров

Очистка корзины

Тесты BuyerModel
Сохранение данных покупателя

Валидация корректных данных

Валидация некорректных данных

Очистка данных

Тесты API
Загрузка товаров с сервера

Обработка ошибок соединения

📋 Функциональные требования
✅ Реализовано
Главная страница с каталогом товаров

Модальное окно просмотра товара

Корзина с добавлением/удалением товаров

Счетчик товаров в корзине

Оформление заказа в два шага

Валидация форм

Отправка заказа на сервер

Сообщение об успешном оформлении

Закрытие модальных окон разными способами

Принципы разработки
TypeScript - строгая типизация для надежности кода

Модульность - четкое разделение ответственности

Dependency Injection - внедрение зависимостей

Error Handling - обработка ошибок на всех уровнях

Событийная модель - все взаимодействия через события

Разделение ответственности - четкое разделение Model-View-Presenter

Типобезопасность - полное использование возможностей TypeScript

Компонентный подход - переиспользуемые компоненты с четкими интерфейсами

Принципы работы View
Разделение ответственности

Каждый класс View отвечает за свой блок разметки

Не содержит бизнес-логику

Только отображение данных и обработка пользовательского ввода

Событийная модель

Все пользовательские действия генерируют события

Презентер подписывается на эти события

View не знает о существовании презентера

Переиспользование

Общий функционал вынесен в родительские классы

Шаблоны используются через `cloneTemplate()`

CSS-классы соответствуют блокам БЭМ

Типизация

Строгая типизация всех свойств и методов

Дженерики для повторно используемых компонентов

Интерфейсы для данных компонентов

Связь с презентером
Каждый компонент View генерирует события, которые обрабатываются соответствующим презентером:


`View (генерирует событие) → Презентер (обрабатывает) → Model (обновляет данные) → View (отображает изменения)`



