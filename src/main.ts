import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ServerApi } from './components/communication/ServerApi';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events';
import { Buyer, ValidationErrors } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { IProduct } from './types';

// ЭТАП 1: Проверка на моковых данных
console.log('--- ТЕСТИРОВАНИЕ НА МОКОВЫХ ДАННЫХ ---');

// 1.1 Подготовка моковых данных
const mockProducts: IProduct[] = [
  { id: 'p1', title: 'Моковый товар 1', description: 'Описание 1', price: 100, image: '', category: 'soft' },
  { id: 'p2', title: 'Моковый товар 2', description: 'Описание 2', price: 200, image: '', category: 'hard' },
  { id: 'p3', title: 'Моковый товар 3', description: 'Описание 3', price: 300, image: '', category: 'other' },
];

// 1.2 Проверка каталога
const catalogModel = new ProductCatalog();
catalogModel.saveProducts(mockProducts);
console.log(`1. Товаров в каталоге: ${catalogModel.getProducts().length}`);
const foundProduct = catalogModel.getProductByID('p2');
catalogModel.saveProduct(foundProduct!); // Сохраняем выбранный
console.log(`2. Выбранный товар: ${catalogModel.getProduct()?.title}`);

// 1.3 Проверка корзины
const events = new EventEmitter();
const basket = new ShoppingCart(events);

basket.pushItem(mockProducts[0]);
basket.pushItem(mockProducts[1]);
basket.pushItem(mockProducts[0]); // Проверка на дубликат
console.log(`3. В корзине товаров: ${basket.countItems()} (Дубликат не засчитан)`);
console.log(`4. Общая сумма: ${basket.evaluateTotalPrice()}`);

basket.discardItem('p1');
console.log(`5. После удаления p1 осталось: ${basket.countItems()}`);

basket.resetCart();
console.log(`6. После очистки корзины товаров: ${basket.countItems()}`);

// 1.4 Проверка покупателя
const buyer = new Buyer();
buyer.setPayment('card');
buyer.setAddress('Москва, ул. Тестовая, д.1');
buyer.setEmail('test@mail.ru');
buyer.setPhone('+79991234567');

const validData = buyer.getData();
console.log('7. Данные покупателя:', validData);

const validErrors = buyer.validateFields();
console.log('8. Ошибки валидации (ожидаем пустой объект):', validErrors);

buyer.resetProfile();
const emptyData = buyer.getData();
console.log('9. Данные после сброса:', emptyData);

const emptyErrors = buyer.validateFields();
console.log('10. Ошибки валидации после сброса:', emptyErrors);


// ЭТАП 2: Интеграция с реальным API
console.log('\n--- ТЕСТИРОВАНИЕ РЕАЛЬНОГО API ---');

const apiClient = new Api(API_URL);
const shopApi = new ServerApi(apiClient);

async function runRealApiScenario() {
  try {
    console.log('Отправляю запрос к /product...');
    const goodsData = await shopApi.requestProductCatalog();
    console.log(`Загружено товаров с сервера: ${goodsData.items.length}`);

    // Сохранение реальных данных в каталог
    catalogModel.saveProducts(goodsData.items);
    
    // Проверка работы метода получения по ID на реальных данных
    if (goodsData.items.length > 0) {
      const realProduct = catalogModel.getProductByID(goodsData.items[0].id);
      console.log(`Первый реальный товар: ${realProduct?.title}`);
    }

  } catch (error) {
    console.error('Ошибка при загрузке с сервера:', error);
  }
}

runRealApiScenario();
