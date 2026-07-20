import { Component } from '../base/Component';

export class Success extends Component<HTMLElement> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', onClose);
    }

    set total(value: number) {
        this.setText(this.totalElement, `Списано ${value} синапсов`);
    }
}
