import { IApi } from '../base/Api';
import { IOrderData, IOrderResponse, IProductList } from '../../types/index';

export class ServerApi {
  protected requester: IApi;

  constructor(apiService: IApi) {
    this.requester = apiService;
  }

  public async requestProductCatalog(): Promise<IProductList> {
    return this.requester.get('/product');
  }

  public async submitOrder(payload: IOrderData): Promise<IOrderResponse> {
    return this.requester.post('/order', payload);
  }
}
