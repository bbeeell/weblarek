import { IProduct } from '../../types/index';

export class ShoppingCart {
  protected selectedProducts: IProduct[];

  constructor() {
    this.selectedProducts = [];
  }

  getSelectedProducts(): IProduct[] {
    return this.selectedProducts;
  }

  addSelectedProduct(product: IProduct) {
    this.selectedProducts.push(product);
  }

  deleteSelectedProduct(id: string) {
    this.selectedProducts = this.selectedProducts.filter(selectedProduct => selectedProduct.id !== id);
  }

  clearShoppingCart() {
    this.selectedProducts = [];
  }

  getTotal(): number | null {
    return this.selectedProducts.reduce((total, selectedProduct) => total + (selectedProduct.price || 0), 0);
  }

  getSelectedProductsAmount(): number {
    return this.selectedProducts.length;
  }

  checkSelectedProduct(id: string): boolean {
    return this.selectedProducts.some(selectedProduct => selectedProduct.id === id);
  }
}
