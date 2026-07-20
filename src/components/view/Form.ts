import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsContainer = container.querySelector('.form__errors') as HTMLElement;

        container.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit(`${container.name}:changed`, { field, value });
        });

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this.submitButton, !value);
    }

    set errors(value: string) {
        this.setText(this.errorsContainer, value);
    }

    // render теперь стандартный. При вызове без аргументов он просто вернёт контейнер.
    render(state?: Partial<T> & { errors?: string }): HTMLElement {
        if (state) {
            const { errors, ...inputs } = state;
            if (errors) this.errors = errors;
            Object.assign(this, inputs);
        }
        return this.container;
    }
}
