import { Card } from './Card';
import { IProduct } from '../../types';

export class CardCatalog extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

        if (onClick) {
            container.addEventListener('click', onClick);
        }
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }
}
