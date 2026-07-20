import { Form } from './Form';
import { IContactsForm } from '../../types';

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}
