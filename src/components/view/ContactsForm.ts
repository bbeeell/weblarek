import { Form } from './Form';
import { IContactsForm } from '../../types';

export class ContactsForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.querySelector('input[name="email"]') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.querySelector('input[name="phone"]') as HTMLInputElement).value = value;
    }
}
