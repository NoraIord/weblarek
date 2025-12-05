// components/view/modal.ts (улучшенная версия)
import { Component } from '../base/component';
import { IEvents } from '../base/events';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    private _handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    private _handleOutsideClick = (event: MouseEvent) => {
        if (event.target === this.container) {
            this.close();
        }
    };

    // Используем этот флаг для предотвращения двойной блокировки
    private _isOpen: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        const closeButton = this.container.querySelector('.modal__close');
        const content = this.container.querySelector('.modal__content');

        if (!closeButton || !content) {
            throw new Error('Не найдены необходимые элементы в модальном окне');
        }

        this._closeButton = closeButton as HTMLButtonElement;
        this._content = content as HTMLElement;

        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', this._handleOutsideClick);
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        if (this._isOpen) return; // Уже открыто

        this._isOpen = true;

        // Метод блокировки скролла
        this._lockScroll();

        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');

        console.log('✅ Модальное окно открыто');
    }

    close() {
        if (!this._isOpen) return; // Уже закрыто

        this._isOpen = false;

        this.container.classList.remove('modal_active');

        // Метод разблокировки скролла
        this._unlockScroll();

        this._content.innerHTML = '';
        document.removeEventListener('keydown', this._handleEscape);
        this.events.emit('modal:close');

        console.log('✅ Модальное окно закрыто');
    }

    private _lockScroll() {
        // Вычисляем ширину скроллбара до блокировки
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Сохраняем текущую позицию скролла
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Блокируем скролл на body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollTop}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';

        // Добавляем отступ справа для компенсации скроллбара
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        // Сохраняем позицию скролла в data-атрибут для восстановления
        document.body.dataset.scrollTop = scrollTop.toString();
    }

    private _unlockScroll() {
        // Восстанавливаем стили body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.paddingRight = '';

        // Восстанавливаем позицию скролла
        const scrollTop = document.body.dataset.scrollTop ?
            parseInt(document.body.dataset.scrollTop) : 0;
        window.scrollTo(0, scrollTop);

        // Удаляем data-атрибут
        delete document.body.dataset.scrollTop;
    }

    render(data?: Partial<IModalData>): HTMLElement {
        if (data?.content) {
            this.content = data.content;
        }
        return this.container;
    }
}