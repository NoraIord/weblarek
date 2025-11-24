import { Component } from '../base/component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICardPreviewActions {
    onAddToBasket: (product: IProduct) => void;
}

export class CardPreviewView extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    // Переименовываем свойства с префиксом _
    protected _id: string = '';
    protected _titleValue: string = '';
    protected _imageValue: string = '';
    protected _categoryValue: string = '';
    protected _priceValue: number | null = null;
    protected _descriptionValue: string = '';

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onAddToBasket) {
            this._button.addEventListener('click', () => {
                actions.onAddToBasket({
                    id: this.id,
                    title: this.title,
                    description: this.description,
                    image: this.image,
                    category: this.category,
                    price: this.price
                } as IProduct);
            });
        }
    }

    // Сеттеры
    set id(value: string) {
        this._id = value;
    }

    set title(value: string) {
        this._titleValue = value;
        this.setText(this._title, value);
    }

    set image(value: string) {
        this._imageValue = value;
        this.setImage(this._image, value);
    }

    set category(value: string) {
        this._categoryValue = value;
        this.setText(this._category, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${categoryClass}`;
    }

    set price(value: number | null) {
        this._priceValue = value;
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');

        // Блокируем кнопку если товар нельзя купить
        if (value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Нельзя купить');
        } else {
            this.setDisabled(this._button, false);
            this.setText(this._button, 'В корзину');
        }
    }

    set description(value: string) {
        this._descriptionValue = value;
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    // Геттеры
    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._titleValue;
    }

    get image(): string {
        return this._imageValue;
    }

    get category(): string {
        return this._categoryValue;
    }

    get price(): number | null {
        return this._priceValue;
    }

    get description(): string {
        return this._descriptionValue;
    }
}