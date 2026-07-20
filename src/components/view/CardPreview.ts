import { Card } from './Card';
import { IProduct } from '../../types';

export class CardPreview extends Card {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, onButtonClick?: () => void) {
        super(container);
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

        if (onButtonClick) {
            this.buttonElement.addEventListener('click', onButtonClick);
        }
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    set buttonText(value: string) {
        this.setText(this.buttonElement, value);
    }

    set disabled(value: boolean) {
        this.setDisabled(this.buttonElement, value);
    }
}
