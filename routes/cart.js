const { Router } = require("express");

const Cart = require("../models/cart");

const router = Router();

router.get("/", async (req, res) => {
  const cart = await Cart.getCart();
  res.render("cart", {
    title: "Корзина",
    cart,
  });
});

module.exports = router;
