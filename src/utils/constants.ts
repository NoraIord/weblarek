export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const categoryMap = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
} as const;

export function ensureElement<T extends HTMLElement>(selector: string, parent?: HTMLElement): T {
    const element = (parent ?? document).querySelector(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);
    return element as T;
}

export function cloneTemplate<T extends HTMLElement>(template: HTMLTemplateElement): T {
    const content = template.content.firstElementChild;
    if (!content) throw new Error('Template is empty');
    return content.cloneNode(true) as T;
}