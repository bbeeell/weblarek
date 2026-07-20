import { Card } from './Card';

export class CardPreview extends Card {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            events.emit('preview:action');
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
