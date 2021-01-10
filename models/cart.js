const fs = require("fs");
const path = require("path");

class Cart {
  static getCart() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "cart.json"),
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        }
      );
    });
  }

  static fillFile(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "cart.json"),
        JSON.stringify(data),
        err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static async addToCart(course) {
    const cart = await Cart.getCart();
    const idx = cart.items.findIndex(item => item.id === course.id);
    if (idx >= 0) {
      cart.items[idx].count++;
    } else {
      course.count = 1;
      cart.items.push(course);
    }
    cart.totalPrice += +course.price;
    await Cart.fillFile(cart);
  }
}

module.exports = Cart;
