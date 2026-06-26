import { IBuyer, TPayment } from "../../types/index";

export class Buyer {
  protected data: IBuyer;

  constructor() {
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  savePaymentType(payment: TPayment) {
    this.data.payment = payment;
  }

  saveAddress(address: string) {
    this.data.address = address;
  }

  saveEmail(email: string) {
    this.data.email = email;
  }

  savePhone(phone: string) {
    this.data.phone = phone;
  }

  getData(): IBuyer {
    return this.data;
  }

  clearBuyerData() {
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  validate(): {
    payment: string;
    address: string;
    email: string;
    phone: string;
  } {
    const errors = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };

    if (!this.data.payment.trim()) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this.data.email.trim()) {
      errors.email = "Укажите email";
    }

    if (!this.data.phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
