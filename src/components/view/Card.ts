import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class Card extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value !== null ? `${value} синапсов` : 'Бесценно');
    }
}
