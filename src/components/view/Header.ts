import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<HTMLElement> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;

        this.basketButton.addEventListener('click', () => this.events.emit('shopping-cart:open'));
    }

    set counter(value: number) {
        this.setText(this.counterElement, String(value));
    }
}
