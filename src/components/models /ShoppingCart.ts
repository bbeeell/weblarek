import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ShoppingCart {
  protected storedItems: IProduct[];
  protected eventBus: IEvents;

  constructor(events: IEvents) {
    this.storedItems = [];
    this.eventBus = events;
  }

  public retrieveAllItems(): IProduct[] {
    return this.storedItems;
  }

  public pushItem(newItem: IProduct): void {
    const isDuplicate = this.storedItems.some(item => item.id === newItem.id);
    if (!isDuplicate) {
      this.storedItems.push(newItem);
      this.eventBus.emit('basket:changed'); 
    }
  }

  public discardItem(targetId: string): void {
    this.storedItems = this.storedItems.filter(item => item.id !== targetId);
    this.eventBus.emit('basket:changed'); 
  }

  public resetCart(): void {
    this.storedItems = [];
    this.eventBus.emit('basket:changed');
  }

  public evaluateTotalPrice(): number {
    return this.storedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  public countItems(): number {
    return this.storedItems.length;
  }

  public verifyItemExistence(itemId: string): boolean {
    return this.storedItems.some(item => item.id === itemId);
  }
}
