import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ServerApi } from './components/communication/ServerApi';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';

// 1. Инициализация инфраструктуры
const eventBus = new EventEmitter(); // Создаем экземпляр класса
const httpClient = new Api(API_URL);
const webLarekApi = new ServerApi(httpClient);

// 2. Инициализация моделей
const userProfile = new Buyer();
const basketModel = new ShoppingCart(eventBus); // Передаем eventBus в корзину

// 3. Основная логика (функция инициализации)
async function runShopScenario() {
  console.log("--- Запуск сценария магазина ---");

  try {
    // Загружаем товары
    const goodsData = await webLarekApi.requestProductCatalog();
    console.log(`Загружено товаров: ${goodsData.items.length}`);
    
    if (goodsData.items.length > 0) {
        const firstProduct = goodsData.items[0];
        console.log(`Первый товар в списке: ${firstProduct.title}`);
        
        // Добавляем в корзину
        basketModel.pushItem(firstProduct);
        console.log(`Товар "${firstProduct.title}" добавлен в корзину.`);
    }
  } catch (err) {
    console.error("Ошибка загрузки каталога:", err);
    return;
  }

  // Тестовый товар
  const dummyProduct = { id: 'test-01', title: 'Тестовый продукт', price: 500 } as any;
  basketModel.pushItem(dummyProduct);

  // Проверяем методы переписанной корзины
  console.log(`В корзине товаров: ${basketModel.countItems()}`);
  console.log(`Общая сумма: ${basketModel.evaluateTotalPrice()} руб.`);
  console.log(`Есть ли тестовый товар? ${basketModel.verifyItemExistence('test-01')}`);

  // Удаляем товар
  basketModel.discardItem('test-01');
  console.log(`После удаления осталось: ${basketModel.countItems()} товаров.`);
  
  // Валидация данных пользователя
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

// Запускаем сценарий
runShopScenario();
