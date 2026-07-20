import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ServerApi } from './components/communication/ServerApi';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { IOrderRequest, IProduct } from './types';

import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { CardBasket } from './components/view/CardBasket';
import { Catalog } from './components/view/Catalog';

// 1. Инфраструктура
const events = new EventEmitter();
const api = new Api(API_URL);
const serverApi = new ServerApi(api);

// 2. Модели
const catalog = new ProductCatalog();
const basket = new ShoppingCart(events);
const buyer = new Buyer();

// 3. Представления 
const modal = new Modal(document.getElementById('modal-container') as HTMLElement, events);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const basketView = new Basket(document.getElementById('basket') as HTMLElement, events);
const orderForm = new OrderForm(document.getElementById('order') as HTMLFormElement, events);
const contactsForm = new ContactsForm(document.getElementById('contacts') as HTMLFormElement, events);
const catalogView = new Catalog(document.querySelector('.gallery') as HTMLElement);

const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardPreview = new CardPreview(
    previewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
    events
);

const success = new Success(
    document.getElementById('success') as HTMLElement,
    () => modal.close()
);

// 4. Обработчики изменений МОДЕЛЕЙ

// Изменение каталога
events.on('catalog:changed', () => {
    const catalogItems = catalog.getProducts();
    const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;

    const cardElements = catalogItems.map(item => {
        const card = new CardCatalog(
            cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
            () => {
                // Генерирация события выбора товара
                events.emit('card:selected', { item });
            }
        );
        card.title = item.title;
        card.price = item.price;
        card.image = CDN_URL + item.image;
        card.category = item.category;
        return card.render();
    });

    catalogView.items = cardElements;
});

// Изменение корзины
events.on('basket:changed', () => {
    header.counter = basket.countItems();
    
    // Если корзина открыта в модалке, идет её обновление
    if (modal.container.classList.contains('modal_active')) {
        const basketItems = basket.retrieveAllItems();
        const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
        
        const itemElements = basketItems.map((item, index) => {
            const card = new CardBasket(
                basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
                events,
                item.id
            );
            card.index = index + 1;
            card.title = item.title;
            card.price = item.price;
            return card.render();
        });

        basketView.items = itemElements;
        basketView.total = basket.evaluateTotalPrice();
    }
});

// Изменение покупателя (Валидация и обновление всех форм)
events.on('buyer:changed', () => {
    const errors = buyer.validateFields();

    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = orderErrors;

    const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = contactsErrors;
});

// 5. Обработчики пользовательских действий (Слушаем события от View)

// Открытие корзины
events.on('shopping-cart:open', () => {
    modal.content = basketView.render();
    modal.open();
    events.emit('basket:changed');
});

// Выбор товара в каталоге
events.on('card:selected', (data: { item: IProduct }) => {
    catalog.saveProduct(data.item);
    events.emit('preview:update');
});

// Обновление превью
events.on('preview:update', () => {
    const selected = catalog.getProduct();
    if (!selected) return;

    cardPreview.title = selected.title;
    cardPreview.price = selected.price;
    cardPreview.image = CDN_URL + selected.image;
    cardPreview.category = selected.category;
    cardPreview.description = selected.description;
    
    const isInCart = basket.verifyItemExistence(selected.id);
    cardPreview.buttonText = isInCart ? 'Удалить из корзины' : 'Купить';
    if (selected.price === null) {
        cardPreview.disabled = true;
        cardPreview.buttonText = 'Недоступно';
    } else {
        cardPreview.disabled = false;
    }

    modal.content = cardPreview.render();
    modal.open();
});

// Нажатие на кнопку в превью (чистый эмит)
events.on('preview:action', () => {
    const selected = catalog.getProduct();
    if (!selected) return;

    if (basket.verifyItemExistence(selected.id)) {
        basket.discardItem(selected.id);
    } else {
        basket.pushItem(selected);
    }
    modal.close();
    // Модель корзины сама эмитит 'basket:changed'.
});

// Удаление товара из корзины
events.on('basket:remove', (data: { id: string }) => {
    basket.discardItem(data.id);
    // Модель корзины сама эмитит 'basket:changed'.
});

// Оформление заказа (Открытие)
events.on('order:open', () => {
    buyer.resetProfile();
    events.emit('buyer:changed'); // Формы станут невалидными
    modal.content = orderForm.render();
    modal.open();
});

// Изменение полей заказа
events.on('order:changed', (data: { field: keyof IOrderRequest; value: string }) => {
    if (data.field === 'payment') buyer.setPayment(data.value as 'card' | 'cash' | '');
    if (data.field === 'address') buyer.setAddress(data.value);
});

// Переход к контактам
events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

// Изменение контактов
events.on('contacts:changed', (data: { field: keyof IOrderRequest; value: string }) => {
    if (data.field === 'email') buyer.setEmail(data.value);
    if (data.field === 'phone') buyer.setPhone(data.value);
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
            success.total = response.total; // Ответ сервера
            modal.content = success.render();
            
            basket.resetCart(); // Эмитит 'basket:changed'
            buyer.resetProfile(); // Эмитит 'buyer:changed'
        }
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// 6. Загрузка каталога
async function loadCatalog() {
    try {
        const data = await serverApi.requestProductCatalog();
        catalog.saveProducts(data.items);
        events.emit('catalog:changed');
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

loadCatalog();
