// components/view/page.ts
import { Component } from '../base/component';

interface IPage {
    gallery: HTMLElement[];
    basketCounter: number;
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        const gallery = container.querySelector('.gallery');
        const basketCounter = container.querySelector('.header__basket-counter');
        const basketButton = container.querySelector('.header__basket');

        if (!gallery || !basketCounter || !basketButton) {
            throw new Error('Не найдены необходимые элементы страницы');
        }

        this._gallery = gallery as HTMLElement;
        this._basketCounter = basketCounter as HTMLElement;
        this._basketButton = basketButton as HTMLButtonElement;
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.innerHTML = '';
        items.forEach(item => {
            this._gallery.appendChild(item);
        });
    }

    set basketCounter(value: number) {
        this.setText(this._basketCounter, value.toString());
    }

    set basketButtonHandler(handler: () => void) {
        this._basketButton.addEventListener('click', handler);
    }
}