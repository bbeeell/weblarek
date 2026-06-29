import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ServerApi } from './components/communication/ServerApi';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';


const eventBus = new EventEmitter();
const httpClient = new Api(API_URL);
const webLarekApi = new ServerApi(httpClient);

const userProfile = new Buyer();
const basketModel = new ShoppingCart(eventBus);

async function runShopScenario() {
  console.log("--- Запуск сценария магазина ---");

  try {
    const goodsData = await webLarekApi.requestProductCatalog();
    console.log(`Загружено товаров: ${goodsData.items.length}`);

    if (goodsData.items.length > 0) {
        const firstProduct = goodsData.items[0];
        console.log(`Первый товар в списке: ${firstProduct.title}`);

        basketModel.pushItem(firstProduct);
        console.log(`Товар "${firstProduct.title}" добавлен в корзину.`);
    }
  } catch (err) {
    console.error("Ошибка загрузки каталога:", err);
    return;
  }

  const dummyProduct = { id: 'test-01', title: 'Тестовый продукт', price: 500 } as any;
  basketModel.pushItem(dummyProduct);

  console.log(`В корзине товаров: ${basketModel.countItems()}`);
  console.log(`Общая сумма: ${basketModel.evaluateTotalPrice()} руб.`);
  console.log(`Есть ли тестовый товар? ${basketModel.verifyItemExistence('test-01')}`);

  basketModel.discardItem('test-01');
  console.log(`После удаления осталось: ${basketModel.countItems()} товаров.`);

  userProfile.paymentType = 'online';
  userProfile.deliveryAddress = 'Санкт-Петербург, Невский пр.';
  userProfile.contactEmail = 'client@mail.com';
  userProfile.contactPhone = '+71234567890';

  const profileErrors = userProfile.validateFields();
  if (Object.keys(profileErrors).length === 0) {
      console.log('Профиль пользователя заполнен корректно.');
  } else {
      console.log('Ошибки в профиле:', profileErrors);
  }
}

runShopScenario();
