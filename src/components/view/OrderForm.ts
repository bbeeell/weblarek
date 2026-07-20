import { Form } from './Form';
import { IOrderForm } from '../../types';

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = Array.from(container.querySelectorAll('button[name="payment"]'));
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:changed', { field: 'payment', value: button.name });
            });
        });
    }

    set payment(value: string) {
        this.paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}
