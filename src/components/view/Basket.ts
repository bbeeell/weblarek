import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<HTMLElement> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = container.querySelector('.basket__price') as HTMLElement;
        this.orderButton = container.querySelector('.basket__button') as HTMLButtonElement;

        this.orderButton.addEventListener('click', () => this.events.emit('order:open'));
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.listElement.innerHTML = '<p>Корзина пуста</p>';
            this.setDisabled(this.orderButton, true);
        } else {
            this.listElement.replaceChildren(...items);
            this.setDisabled(this.orderButton, false);
        }
    }

    set total(value: number) {
        this.setText(this.totalElement, `${value} синапсов`);
    }
}
