export function ensureElement<T extends HTMLElement>(selector: string, parent?: HTMLElement): T {
    const element = (parent ?? document).querySelector(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);
    return element as T;
}

// ДОБАВЛЯЕМ обратно cloneTemplate если используется в других местах
export function cloneTemplate<T extends HTMLElement>(template: HTMLTemplateElement): T {
    const content = template.content.firstElementChild;
    if (!content) throw new Error('Template is empty');
    return content.cloneNode(true) as T;
}