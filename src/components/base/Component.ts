export abstract class Component<T> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }

    protected setText(element: HTMLElement, value: string): void {
        element.textContent = value;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        element.src = src;
        if (alt) {
            element.alt = alt;
        }
    }
    
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (state) {
            element.setAttribute('disabled', 'disabled');
        } else {
            element.removeAttribute('disabled');
        }
    }
}
