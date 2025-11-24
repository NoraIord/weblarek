import { Component } from '../base/component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardView extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    // Переименовываем свойства с префиксом _
    protected _id: string = '';
    protected _titleValue: string = '';
    protected _imageValue: string = '';
    protected _categoryValue: string = '';
    protected _priceValue: number | null = null;
    protected _descriptionValue: string = '';

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
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
    }

    set description(value: string) {
        this._descriptionValue = value;
    }

    // Геттеры для доступа к данным
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