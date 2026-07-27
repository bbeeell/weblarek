import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;
    protected eventBus: IEvents;

    constructor(events: IEvents) {
        this.eventBus = events;
    }

    public saveProducts(products: IProduct[]): void {
        this.products = products;
        this.eventBus.emit('catalog:changed');
    }

    public getProducts(): IProduct[] {
        return this.products;
    }

    public getProductByID(id: string): IProduct | undefined {
        return this.products.find(item => item.id === id);
    }

    public saveProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.eventBus.emit('preview:update');
    }

    public getProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
