export class Buyer {
  public paymentType: string;
  public deliveryAddress: string;
  public contactEmail: string;
  public contactPhone: string;

  constructor() {
    this.paymentType = "";
    this.deliveryAddress = "";
    this.contactEmail = "";
    this.contactPhone = "";
  }

  public resetProfile(): void {
    this.paymentType = "";
    this.deliveryAddress = "";
    this.contactEmail = "";
    this.contactPhone = "";
  }

  public validateFields(): Record<string, string> {
    const validationErrors: Record<string, string> = {};

    if (!this.paymentType || this.paymentType.trim().length === 0) {
      validationErrors.paymentType = "Необходимо выбрать способ оплаты";
    }

    if (!this.deliveryAddress || this.deliveryAddress.trim().length === 0) {
      validationErrors.deliveryAddress = "Не указан адрес доставки";
    }

    if (!this.contactEmail || this.contactEmail.trim().length === 0) {
      validationErrors.contactEmail = "Не указан email";
    }

    if (!this.contactPhone || this.contactPhone.trim().length === 0) {
      validationErrors.contactPhone = "Не указан номер телефона";
    }

    return validationErrors;
  }
}
