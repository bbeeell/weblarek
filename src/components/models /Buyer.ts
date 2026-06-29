import { IBuyer, TPayment } from '../../types/index';

// Вынос типа ошибок валидации в именованный тип
export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  // Защищата поля от прямого изменения извне
  protected _payment: TPayment;
  protected _address: string;
  protected _email: string;
  protected _phone: string;

  constructor() {
    this._payment = '';
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  // Сеттеры для установки значений полей
  public setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  public setAddress(address: string): void {
    this._address = address;
  }

  public setEmail(email: string): void {
    this._email = email;
  }

  public setPhone(phone: string): void {
    this._phone = phone;
  }

  // Метод для получения полного объекта данных
  public getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  // Сброс данных до начальных значений
  public resetProfile(): void {
    this._payment = '';
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  // Валидация с использованием вынесенного типа
  public validateFields(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this._payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this._address || this._address.trim().length === 0) {
      errors.address = 'Не указан адрес доставки';
    }

    if (!this._email || this._email.trim().length === 0) {
      errors.email = 'Не указан email';
    }

    if (!this._phone || this._phone.trim().length === 0) {
      errors.phone = 'Не указан номер телефона';
    }

    return errors;
  }
}
