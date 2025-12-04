export abstract class Component<T> {
    // Изменяем protected на public или добавляем геттер
    public container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Установка текста элемента
    protected setText(element: HTMLElement, value: string): void {
        element.textContent = value;
    }

    // Установка изображения
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        element.src = src;
        if (alt) element.alt = alt;
    }

    // Установка состояния disabled
    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (state) {
            element.setAttribute('disabled', 'true');
        } else {
            element.removeAttribute('disabled');
        }
    }

    // Установка видимости элемента
    protected setVisible(element: HTMLElement, state: boolean): void {
        element.style.display = state ? 'block' : 'none';
    }

    // Рендер компонента
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data);
        return this.container;
    }
}