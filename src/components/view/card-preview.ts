
import { Component } from '../base/component';

interface ICardPreview {
    title: string;
    price: number | null;
    category: string;
    image: string;
    description: string;
}

export class CardPreview extends Component<ICardPreview> {
    // Аналогично классу Card, но с дополнительными полями
    // Реализация аналогична Card, но использует шаблон #card-preview
}