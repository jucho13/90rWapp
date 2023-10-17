export default class productModelFS {
    constructor(title, description, price, thumbnail, code, stock, status, id) {
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = [thumbnail];
      this.code = code;
      this.stock = stock;
      this.status = status;
      this.id = id;
    }
  }