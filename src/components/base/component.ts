export abstract class Component<T> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    protected setText(element: HTMLElement, value: string): void {
        element.textContent = value;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        element.src = src;
        if (alt) element.alt = alt;
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (state) {
            element.setAttribute('disabled', 'true');
        } else {
            element.removeAttribute('disabled');
        }
    }

    // Упрощаем render метод
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            // Просто присваиваем данные без Object.assign
            for (const key in data) {
                if (data[key] !== undefined) {
                    (this as any)[key] = data[key];
                }
            }
        }
        return this.container;
    }
}