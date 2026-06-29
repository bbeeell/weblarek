import { IApi } from '../base/Api';
import { IOrderData, IOrderResponse, IProductList } from '../../types/index';

export class ServerApi {
  protected requestHandler: IApi;

  constructor(apiInstance: IApi) {
    this.requestHandler = apiInstance;
  }

  public async fetchGoods(): Promise<IProductList> {
    return this.requestHandler.get('/product');
  }

  public async placeNewOrder(orderDetails: IOrderData): Promise<IOrderResponse> {
    return this.requestHandler.post('/order', orderDetails);
  }
}
