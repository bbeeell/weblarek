import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
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

// 2. Модели (Передача events в модели для эмитов)
const catalog = new ProductCatalog(events);
const basket = new ShoppingCart(events);
const buyer = new Buyer();

// 3. Представления (ВСЕ через cloneTemplate)
const modal = new Modal(cloneTemplate('#modal-container'), events);
const header = new Header(document.querySelector('.header') as HTMLElement, events); // Шапка статична
const basketView = new Basket(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);
const catalogView = new Catalog(document.querySelector('.gallery') as HTMLElement);

// Превью создается один раз
const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);

// Success создается один раз
const success = new Success(cloneTemplate('#success'), () => modal.close());

// 4. Обработчики изменений МОДЕЛЕЙ

events.on('catalog:changed', () => {
    const catalogItems = catalog.getProducts();
    const cardElements = catalogItems.map(item => {
        const card = new CardCatalog(
            cloneTemplate('#card-catalog'),
            () => events.emit('card:selected', { item })
        );
        card.title = item.title;
        card.price = item.price;
        card.image = CDN_URL + item.image;
        card.category = item.category;
        return card.render();
    });
    catalogView.items = cardElements;
});

events.on('basket:changed', () => {
    header.counter = basket.countItems();
    
    if (modal.container.classList.contains('modal_active')) {
        const basketItems = basket.retrieveAllItems();
        const itemElements = basketItems.map((item, index) => {
            const card = new CardBasket(
                cloneTemplate('#card-basket'),
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

events.on('buyer:changed', () => {
    const data = buyer.getData();
    const errors = buyer.validateFields();

    orderForm.payment = data.payment;
    orderForm.address = data.address;
    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = orderErrors;

    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = contactsErrors;
});

// 5. Обработчики пользовательских действий

events.on('shopping-cart:open', () => {
    modal.content = basketView.render();
    modal.open();
});

events.on('card:selected', (data: { item: IProduct }) => {
    catalog.saveProduct(data.item);
});

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

events.on('preview:action', () => {
    const selected = catalog.getProduct();
    if (!selected) return;

    if (basket.verifyItemExistence(selected.id)) {
        basket.discardItem(selected.id);
    } else {
        basket.pushItem(selected);
    }
    modal.close();
});

events.on('basket:remove', (data: { id: string }) => {
    basket.discardItem(data.id);
});

events.on('order:open', () => {
    buyer.resetProfile();
    modal.content = orderForm.render();
    modal.open();
});

events.on('order:changed', (data: { field: keyof IOrderRequest; value: string }) => {
    if (data.field === 'payment') buyer.setPayment(data.value as 'card' | 'cash' | '');
    if (data.field === 'address') buyer.setAddress(data.value);
});

events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

events.on('contacts:changed', (data: { field: keyof IOrderRequest; value: string }) => {
    if (data.field === 'email') buyer.setEmail(data.value);
    if (data.field === 'phone') buyer.setPhone(data.value);
});

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
            success.total = response.total;
            modal.content = success.render();
            
            basket.resetCart();
            buyer.resetProfile();
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
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

loadCatalog();
