import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ShoppingCart {
  protected productList: IProduct[];
  protected eventManager: IEvents; 

  constructor(emitter: IEvents) {
    this.productList = [];
    this.eventManager = emitter;
  }

  public getItems(): IProduct[] {
    return this.productList;
  }

  public appendItem(item: IProduct): void {
    this.productList.push(item);
    this.eventManager.emit('basket:updated');
  }

  public removeItem(itemId: string): void {
    this.productList = this.productList.filter((currentItem) => currentItem.id !== itemId);
    this.eventManager.emit('basket:updated');
  }

  public clearCart(): void {
    this.productList = [];
    this.eventManager.emit('basket:updated');
  }

  public calculateTotal(): number {
    if (!this.productList || this.productList.length === 0) {
      return 0;
    }
    return this.productList.reduce((sum, currentItem) => sum + (currentItem.price || 0), 0);
  }

  public getItemCount(): number {
    return this.productList.length;
  }

  public isItemInCart(itemId: string): boolean {
    return this.productList.some((storedItem) => storedItem.id === itemId);
  }
}
