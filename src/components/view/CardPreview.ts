import { Card } from './Card';
import { IEvents } from '../base/Events';

export class CardPreview extends Card {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:action');
        });
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
