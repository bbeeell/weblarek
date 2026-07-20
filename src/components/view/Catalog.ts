import { Component } from '../base/Component';

export class Catalog extends Component<HTMLElement> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
