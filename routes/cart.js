const { Router } = require("express");

const Cart = require("../models/cart");
const Course = require("../models/course");

const router = Router();

router.get("/", async (req, res) => {
  const cart = await Cart.getCart();
  res.render("cart", {
    title: "Корзина",
    cart,
  });
});

router.delete("/remove/:id", async (req, res) => {
  const cart = await Cart.removeFromCart(req.params.id);
  res.json(cart);
});

router.post("/add", async (req, res) => {
  const course = await Course.getCourse(req.body.id);
  await Cart.addToCart(course);
  res.redirect("/cart");
});

module.exports = router;
