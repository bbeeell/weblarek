import { IProduct } from '../../types/index';

export class ProductCatalog {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  public saveProducts(products: IProduct[]): void {
    this.products = products;
  }

  public getProducts(): IProduct[] {
    return this.products;
  }

  public getProductByID(id: string): IProduct | undefined {
    return this.products.find(item => item.id === id);
  }

  // Убрала null из типа параметра
  public saveProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  public getProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
