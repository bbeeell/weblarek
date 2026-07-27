import { Card } from './Card';
import { IEvents } from '../base/Events';

export class CardBasket extends Card {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, itemId: string) {
        super(container);
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: itemId });
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, String(value));
    }
}
