import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerApi } from "./components/communication/ServerApi";
import { IOrderResultApi, IProduct, TPayment } from "./types";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CardPreview } from "./components/views/Card/CardPreview";
import { Modal } from "./components/views/Modal";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Header } from "./components/views/Header";
import { CardBasket } from "./components/views/Card/CardBasket";
import { Basket } from "./components/views/Basket";
import { Buyer } from "./components/models/Buyer";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";
import { Success } from "./components/views/Success";

// Запрос на сервер для получения каталога товаров
const events = new EventEmitter();
const productsModel = new ProductCatalog(events);
const apiModel = new Api(API_URL);
const serverApiModel = new ServerApi(apiModel);
serverApiModel
  .getProducts()
  .then((result: IOrderResultApi) => {
    console.log("Товары получены с сервера");
    productsModel.saveProducts(result.items);
  })
  .catch((error) => {
    console.error("Ошибка", error);
  });

const gallery = new Gallery(ensureElement(".gallery"));
events.on("card-catalog:changed", () => {
  const items = productsModel.getProducts().map((item) => {
    const cardCatalog = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:selected", item),
    });
    return cardCatalog.render(item);
  });
  gallery.render({ catalog: items });
});

const modal = new Modal(ensureElement("#modal-container"), events);
events.on("card:selected", (item: IProduct) => {
  productsModel.saveProduct(item); 
});

events.on("product:selected", (item: IProduct) => {
  const isInShoppingCart = shoppingCartModel.checkSelectedProduct(item.id);
  const cardPreview = new CardPreview(cloneTemplate("#card-preview"), {
    onButtonClick: () => {
      if (isInShoppingCart) {
        shoppingCartModel.deleteSelectedProduct(item.id);
      } else if (item.price !== null) {
        shoppingCartModel.addSelectedProduct(item);
      }
      modal.close();
    },
  });
  modal.content = cardPreview.render({
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    description: item.description,
  });
  cardPreview.setPurchaseOpportunity(isInShoppingCart, item.price);
  modal.open();
});

const shoppingCartModel = new ShoppingCart(events);
const header = new Header(ensureElement(".header"), events);
events.on("shopping-cart:changed", () => {
  header.counter = shoppingCartModel.getSelectedProductsAmount();
  const shoppingCartItems = shoppingCartModel.getSelectedProducts()
    .map((item, index) => {
      const cardBasket = new CardBasket(cloneTemplate("#card-basket"), events);
      return cardBasket.render({
        id: item.id,
        title: item.title,
        price: item.price,
        index: index + 1,
      });
    });
  basket.items = shoppingCartItems;
  basket.price = shoppingCartModel.getTotal() || 0;
  const isEmpty = shoppingCartModel.getSelectedProductsAmount() === 0;
  basket.setPurchaseOpportunity(isEmpty);
});

const basket = new Basket(cloneTemplate("#basket"), events);
events.on("shopping-cart:open", () => {
  const isEmpty = shoppingCartModel.getSelectedProductsAmount() === 0;
  basket.setPurchaseOpportunity(isEmpty);
  modal.content = basket.render();
  modal.open();
});

events.on("shopping-cart:remove", (data: { id: string }) => {
  shoppingCartModel.deleteSelectedProduct(data.id);
});

const buyerModel = new Buyer(events);
const currentOrderForm = new OrderForm(cloneTemplate("#order"), events);
const currentContactsForm = new ContactsForm(cloneTemplate("#contacts"), events);
events.on("order:changed", (data: { field: string; value: string }) => {
  if (data.field === "payment") {
    buyerModel.savePaymentType(data.value as TPayment);
  } else if (data.field === "address") {
    buyerModel.saveAddress(data.value);
  }
});

events.on("contacts:changed", (data: { field: string; value: string }) => {
  if (data.field === "email") {
    buyerModel.saveEmail(data.value);
  } else if (data.field === "phone") {
    buyerModel.savePhone(data.value);
  }
});

events.on("buyer-data:changed", (data: { field: string }) => {
  const validation = buyerModel.validate();
  const buyerData = buyerModel.getData();

  if (data.field === "payment" || data.field === "address" || data.field === "all") {
    if (currentOrderForm) {
      currentOrderForm.payment = buyerData.payment;
      currentOrderForm.address = buyerData.address;
      const paymentValid = !validation.payment && !validation.address;
      currentOrderForm.valid = paymentValid;
      const orderErrors = [validation.payment, validation.address].filter(Boolean);
      currentOrderForm.errors = orderErrors;
    }
  }

  if (data.field === "email" || data.field === "phone" || data.field === "all") {
    if (currentContactsForm) {
      currentContactsForm.email = buyerData.email;
      currentContactsForm.phone = buyerData.phone;
      const contactsValid = !validation.email && !validation.phone;
      currentContactsForm.valid = contactsValid;
      const contactsErrors = [validation.email, validation.phone].filter(Boolean);
      currentContactsForm.errors = contactsErrors;
    }
  }
});

events.on("order:open", () => {
  modal.content = currentOrderForm.render();
  events.emit("buyer-data:changed", { field: "all" });
});

events.on("order:submit", () => {
  modal.content = currentContactsForm.render();
  events.emit("buyer-data:changed", { field: "all" });
});

events.on("contacts:submit", () => {
  const orderData = {
    ...buyerModel.getData(),
    items: shoppingCartModel.getSelectedProducts().map((item) => item.id),
    total: shoppingCartModel.getTotal(),
  };

  serverApiModel.postOrder(orderData)
    .then(() => {
      const success = new Success(cloneTemplate("#success"), {
        onClick: () => {
          modal.close();
        },
      });
      success.total = shoppingCartModel.getTotal();
      modal.content = success.render();

      buyerModel.clearBuyerData();
      shoppingCartModel.clearShoppingCart();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});
