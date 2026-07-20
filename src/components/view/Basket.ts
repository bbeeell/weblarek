import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class CardBasket extends Component<HTMLElement> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents, itemId: string) {
        super(container);
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: itemId });
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, String(value));
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value !== null ? `${value} синапсов` : 'Бесценно');
    }
}
