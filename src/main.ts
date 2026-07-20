import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ServerApi } from './components/communication/ServerApi';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { IOrderData, IProduct } from './types';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

// 1. Инициализация инфраструктуры
const events = new EventEmitter();
const api = new Api(API_URL);
const serverApi = new ServerApi(api);

// 2. Инициализация моделей
const catalog = new ProductCatalog();
const basket = new ShoppingCart(events);
const buyer = new Buyer();

// 3. Инициализация представлений
const modal = new Modal(document.getElementById('modal-container') as HTMLElement, events);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const basketView = new Basket(document.getElementById('basket') as HTMLElement, events);
const orderForm = new OrderForm(document.getElementById('order') as HTMLFormElement, events);
const contactsForm = new ContactsForm(document.getElementById('contacts') as HTMLFormElement, events);

// 4. События для UI (рендеринг)

// Обновление счетчика корзины
events.on('cart:item-added', () => {
    header.counter = basket.countItems();
});
events.on('cart:item-removed', () => {
    header.counter = basket.countItems();
});

// Открытие корзины
events.on('shopping-cart:open', () => {
    const items = basket.retrieveAllItems();
    const itemElements = items.map((item, index) => {
        const card = new CardBasket(
            document.getElementById('card-basket')?.innerHTML as string,
            events
        );
        card.index = index + 1;
        card.title = item.title;
        card.price = item.price;
        // Идентифицируем товар в корзине по data-id
        card.container.dataset.id = item.id;
        return card.render();
    });
    
    basketView.items = itemElements;
    basketView.total = basket.evaluateTotalPrice();
    modal.content = basketView.render();
    modal.open();
});

// Удаление товара из корзины (внутри корзины)
events.on('shopping-cart:remove', (data: { id: string }) => {
    basket.discardItem(data.id);
    // Перерисовываем корзину
    events.emit('shopping-cart:open');
});

// Открытие превью товара
events.on('card:selected', (data: { item: IProduct }) => {
    const cardPreview = new CardPreview(
        document.getElementById('card-preview')?.innerHTML as string,
        () => {
            if (basket.verifyItemExistence(data.item.id)) {
                basket.discardItem(data.item.id);
            } else {
                basket.pushItem(data.item);
            }
            modal.close();
            events.emit('cart:item-added');
        }
    );
    
    cardPreview.title = data.item.title;
    cardPreview.price = data.item.price;
    cardPreview.image = CDN_URL + data.item.image;
    cardPreview.category = data.item.category;
    cardPreview.description = data.item.description;
    
    const isInCart = basket.verifyItemExistence(data.item.id);
    cardPreview.buttonText = isInCart ? 'Удалить из корзины' : 'Купить';
    cardPreview.disabled = data.item.price === null;
    if (data.item.price === null) cardPreview.buttonText = 'Недоступно';

    modal.content = cardPreview.render();
    modal.open();
});

// Оформление заказа (Шаг 1)
events.on('order:open', () => {
    orderForm.render({ payment: 'card', address: '', valid: false, errors: '' });
    modal.content = orderForm.render();
    modal.open();
});

// Валидация формы заказа (Шаг 1)
events.on('order:changed', (data: { field: keyof IOrderData; value: string }) => {
    if (data.field === 'payment') buyer.setPayment(data.value as 'card' | 'cash' | '');
    if (data.field === 'address') buyer.setAddress(data.value);
    
    const errors = buyer.validateFields();
    const isValid = Object.keys(errors).length === 0;
    orderForm.valid = isValid;
    orderForm.errors = Object.values(errors).join('; ');
});

// Переход к контактам (Шаг 2)
events.on('order:submit', () => {
    contactsForm.render({ email: '', phone: '', valid: false, errors: '' });
    modal.content = contactsForm.render();
});

// Валидация контактов (Шаг 2)
events.on('contacts:changed', (data: { field: keyof IOrderData; value: string }) => {
    if (data.field === 'email') buyer.setEmail(data.value);
    if (data.field === 'phone') buyer.setPhone(data.value);
    
    const errors = buyer.validateFields();
    const isValid = Object.keys(errors).length === 0;
    contactsForm.valid = isValid;
    contactsForm.errors = Object.values(errors).join('; ');
});

// Отправка заказа
events.on('contacts:submit', async () => {
    try {
        const response = await serverApi.submitOrder({
            payment: buyer.getData().payment as 'card' | 'cash',
            address: buyer.getData().address,
            email: buyer.getData().email,
            phone: buyer.getData().phone,
            total: basket.evaluateTotalPrice(),
            items: basket.retrieveAllItems().map(item => item.id)
        });

        if (response) {
            const success = new Success(
                document.getElementById('success') as HTMLElement,
                () => modal.close()
            );
            success.total = basket.evaluateTotalPrice();
            modal.content = success.render();
            
            basket.resetCart();
            buyer.resetProfile();
            header.counter = 0;
        }
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// 5. Загрузка каталога с сервера
async function loadCatalog() {
    try {
        const data = await serverApi.requestProductCatalog();
        catalog.saveProducts(data.items);

        const gallery = document.querySelector('.gallery') as HTMLElement;
        const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;

        const cardElements = catalog.getProducts().map(item => {
            const card = new CardCatalog(
                cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
                () => events.emit('card:selected', { item })
            );
            card.title = item.title;
            card.price = item.price;
            card.image = CDN_URL + item.image;
            card.category = item.category;
            return card.render();
        });

        gallery.replaceChildren(...cardElements);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

loadCatalog();
