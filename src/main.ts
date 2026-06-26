import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ShoppingCart } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ServerApi } from './components/communication/ServerAPI';
import { IOrderResultApi } from './types';

// Проверка работы моделей данных
const productsModel = new ProductCatalog();
productsModel.saveProducts(apiProducts.items); // Cохранение массива товаров, полученного в параметрах метода, в модель каталога
console.log('Массив товаров из каталога: ', productsModel.getProducts()); // Получение массива товаров из модели
console.log('Найденный по id товар: ', productsModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c390")); // Получение одного товара по его id
console.log('Ненайденный по id товар: ', productsModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c391")); // Получение одного товара по его id
productsModel.saveProduct(apiProducts.items[0]); // Cохранение товара для подробного отображения
console.log('Получение для подробного отображения товара : ', productsModel.getProduct()); // Получение товара для подробного отображения

const shoppingCartModel = new ShoppingCart();
shoppingCartModel.addSelectedProduct(apiProducts.items[0]); // Добавление товара, который был получен в параметре, в массив корзины
shoppingCartModel.addSelectedProduct(apiProducts.items[1]);
shoppingCartModel.addSelectedProduct(apiProducts.items[2]);
console.log('Массив товаров, которые находятся в корзине: ', shoppingCartModel.getSelectedProducts()); // Получение массива товаров, которые находятся в корзине
console.log('Проверка наличия товара в корзине: ', shoppingCartModel.checkSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390")); // Проверка наличия товара в корзине по его id, полученного в параметр метода
shoppingCartModel.deleteSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390"); // Удаление товара, полученного в параметре из массива корзины
console.log('Проверка наличия товара в корзине после удаления товара: ', shoppingCartModel.checkSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log('Массив товаров, которые находятся в корзине после удаления товара: ', shoppingCartModel.getSelectedProducts());
console.log('Количество товаров в корзине: ', shoppingCartModel.getSelectedProductsAmount()); // Получение количества товаров в корзине
console.log('Стоимость всех товаров в корзине: ', shoppingCartModel.getTotal()); // Получение стоимости всех товаров в корзине
shoppingCartModel.clearShoppingCart(); // Очистка корзины
console.log('Массив товаров, которые находятся в корзине, после очистки корзины: ', shoppingCartModel.getSelectedProducts());

const buyerModel = new Buyer();
buyerModel.savePaymentType('card'); // Сохранение типа оплаты в модели
buyerModel.saveAddress('Moscow, Leninskaya st'); // Сохранение адреса в модели
buyerModel.saveEmail('buyer@gmail.com'); // Сохранение email в модели
buyerModel.savePhone('89038752853'); // Сохранение телефона в модели
console.log('Данные покупателя: ', buyerModel.getData()); // Получение всех данных покупателя
buyerModel.clearBuyerData(); // Очистка данных покупателя
console.log('Данные покупателя после очистки данных: ', buyerModel.getData());
console.log('Валидация данных покупателя: ', buyerModel.validate()); // Валидация данных

// Запрос на сервер для получения каталога товаров
const apiModel = new Api(API_URL);
const serverApiModel = new ServerApi(apiModel);
serverApiModel.getProducts()
  .then((result: IOrderResultApi) => {
    console.log('Товары получены с сервера');
    productsModel.saveProducts(result.items);
    console.log('Массив товаров с сервера: ', productsModel.getProducts()); // Проерка работы класса ProductCatalog
    console.log('Найденный по id товар: ', productsModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c390"));
    console.log('Ненайденный по id товар: ', productsModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c391"));
    productsModel.saveProduct(result.items[0]);
    console.log('Получение для подробного отображения товара : ', productsModel.getProduct());

    shoppingCartModel.addSelectedProduct(result.items[0]); // Проерка работы класса ShoppingCart
    shoppingCartModel.addSelectedProduct(result.items[1]);
    console.log('Массив товаров, которые находятся в корзине: ', shoppingCartModel.getSelectedProducts());
    console.log('Проверка наличия товара в корзине: ', shoppingCartModel.checkSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
    shoppingCartModel.deleteSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
    console.log('Проверка наличия товара в корзине после удаления товара: ', shoppingCartModel.checkSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
    console.log('Массив товаров, которые находятся в корзине после удаления товара: ', shoppingCartModel.getSelectedProducts());
    console.log('Количество товаров в корзине: ', shoppingCartModel.getSelectedProductsAmount());
    console.log('Стоимость всех товаров в корзине: ', shoppingCartModel.getTotal());
    shoppingCartModel.clearShoppingCart();
    console.log('Массив товаров, которые находятся в корзине, после очистки корзины: ', shoppingCartModel.getSelectedProducts());
  })
  .catch(error => {
    console.error('Ошибка', error);
  });
