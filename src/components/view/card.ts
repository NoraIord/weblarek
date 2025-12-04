import { Component } from '../base/component';
// Убираем неиспользуемый импорт IProduct, так как у нас есть свой ICardData
// import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// Создаем отдельный интерфейс для данных Card
export interface ICardData {
    id?: string;
    description?: string;
    image?: string;
    title?: string;
    category?: string;
    price?: number | null;
    buttonText?: string;
    buttonDisabled?: boolean;
}

export class Card extends Component<ICardData> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        const title = this.container.querySelector('.card__title');
        const image = this.container.querySelector('.card__image');
        const category = this.container.querySelector('.card__category');
        const price = this.container.querySelector('.card__price');
        const button = this.container.querySelector('.card__button');
        const description = this.container.querySelector('.card__text');

        if (!title || !image || !category || !price) {
            throw new Error('Не найдены обязательные элементы карточки');
        }

        this._title = title as HTMLElement;
        this._image = image as HTMLImageElement;
        this._category = category as HTMLElement;
        this._price = price as HTMLElement;

        if (button) {
            this._button = button as HTMLButtonElement;
        }

        if (description) {
            this._description = description as HTMLElement;
        }

        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        } else if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent || '');
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = 'card__category ' + categoryClass;
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }

    set buttonDisabled(state: boolean) {
        if (this._button) {
            this.setDisabled(this._button, state);
        }
    }

    render(data?: Partial<ICardData>): HTMLElement {
        super.render(data);
        return this.container;
    }
}