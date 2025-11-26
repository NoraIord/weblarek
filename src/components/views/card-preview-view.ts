// src/components/views/card-preview-view.ts

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
                const product: IProduct = {
                    id: this.container.dataset.id || '',
                    title: this._title.textContent || '',
                    description: this._description.textContent || '',
                    image: this._image.src.replace(window.location.origin, ''), // Убираем origin из пути
                    category: this._category.textContent || '',
                    price: this.getPriceValue()
                };
                actions.onAddToBasket(product);
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${categoryClass}`;
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');

        if (value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Нельзя купить');
        } else {
            this.setDisabled(this._button, false);
            this.setText(this._button, 'В корзину');
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    private getPriceValue(): number | null {
        const priceText = this._price.textContent;
        if (!priceText || priceText === 'Бесценно') return null;

        const match = priceText.match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
    }
}
