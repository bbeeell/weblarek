import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<HTMLElement> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (evt) => {
            if (evt.target === container) this.close();
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open() {
        this.toggleClass(this.container, 'modal_active', true);
        this.events.emit('modal:open');
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this.contentElement.innerHTML = ''; // Очистка контента
        this.events.emit('modal:close');
    }
}
