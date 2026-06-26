import { Api } from '../base/Api';
import { IApi, IOrderRequest, TOrderResponse, IOrderResultApi } from '../../types/index';

export class ServerApi {
  protected api: IApi;

  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(): Promise<IOrderResultApi> {
    return this.api.get('/product/');
  }

  async postOrder(orderRequest: IOrderRequest): Promise<TOrderResponse> {
    return this.api.post('/order/', orderRequest);
  }
}
