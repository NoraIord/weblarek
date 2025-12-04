import { Component } from '../base/component';
import { IEvents } from '../base/events.ts';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        const closeButton = this.container.querySelector('.modal__close');
        const content = this.container.querySelector('.modal__content');

        if (!closeButton || !content) {
            throw new Error('Не найдены необходимые элементы в модальном окне');
        }

        this._closeButton = closeButton as HTMLButtonElement;
        this._content = content as HTMLElement;

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.handleOutsideClick.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscape.bind(this));
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        document.removeEventListener('keydown', this.handleEscape.bind(this));
        this.events.emit('modal:close');
    }

    private handleEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    private handleOutsideClick(event: MouseEvent) {
        if (event.target === this.container) {
            this.close();
        }
    }

    render(data?: IModalData): HTMLElement {
        if (data?.content) {
            this.content = data.content;
        }
        return this.container;
    }
}