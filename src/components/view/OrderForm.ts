import { Form } from './Form';
import { IOrderForm } from '../../types';

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = Array.from(container.querySelectorAll('button[name="payment"]'));
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
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
        (this.container.querySelector('input[name="address"]') as HTMLInputElement).value = value;
    }
}
