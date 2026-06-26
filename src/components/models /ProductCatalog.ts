import { IProduct } from "../../types/index";

export class ProductCatalog {
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;

  constructor() {
    this.products = [];
    this.selectedProduct = null;
  }

  saveProducts(products: IProduct[]) {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductByID(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  saveProduct(product: IProduct | null) {
    this.selectedProduct = product;
  }

  getProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
