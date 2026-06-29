import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ServerApi } from './components/communication/ServerApi';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events'; // Предполагаем, что у вас есть этот класс
import { Buyer } from './components/models/Buyer';

const eventBus = new EventEmitter();
const apiClient = new Api(API_URL);
const shopApi = new ServerApi(apiClient);
const buyerModel = new Buyer();
const shoppingCart = new ShoppingCart(eventBus);

async function initApplication() {
  console.log("--- Запуск приложения ---");

  try {
    const productData = await shopApi.fetchGoods();
    console.log(`Успешно загружено ${productData.items.length} товаров.`);

    if (productData.items.length > 0) {
        console.log(`Первый товар: ${productData.items[0].title}`);
    }
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
    return;
  }

  const mockProduct1 = { id: '123', title: 'Товар A', price: 100 } as any;
  const mockProduct2 = { id: '456', title: 'Товар B', price: 200 } as any;

  shoppingCart.appendItem(mockProduct1);
  shoppingCart.appendItem(mockProduct2);
  
  console.log(`В корзине товаров: ${shoppingCart.getItemCount()}. Итоговая сумма: ${shoppingCart.calculateTotal()}`);

  console.log(`Есть ли товар '123' в корзине? ${shoppingCart.isItemInCart('123')}`);

  shoppingCart.removeItem('123');
  console.log(`После удаления: в корзине ${shoppingCart.getItemCount()} товара(ов).`);

  buyerModel.paymentType = 'card';
  buyerModel.deliveryAddress = 'Москва, ул. Пушкина, д. 1';
  buyerModel.contactEmail = 'test@mail.ru';
  buyerModel.contactPhone = '+79991234567';

  const errors = buyerModel.validateFields();
  if (Object.keys(errors).length === 0) {
    console.log("Данные покупателя валидны.");
    
  } else {
    console.error("Ошибки валидации:", errors);
  }
  
  console.log("--- Конец проверки ---");
}

// Запускаем приложение
initApplication();
